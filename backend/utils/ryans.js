import { parsePrice } from "./converter.js";
import { launchBrowser } from "./puppeteer-browser.js";
import { safeGoto } from "./safe-goto.js";

export const getRyansSearchedProducts = async (page, searchKey = "", currentPage = 1) => {
  try {
    const url = `https://www.ryans.com/search?q=${searchKey}&page=${currentPage}`;
    // const url = `https://www.ryans.com/search?q=keyboard`;
    const success = await safeGoto(page, url);
    if (!success) return [];

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".card.h-100");

      return {
        data: Array.from(productElements).map((product) => {
          const imageUrl = product.querySelector(".image-box img")?.getAttribute("src") || "";
          const title = product.querySelector(".card-body .card-text a")?.innerText?.trim()?.split("\n")?.[0] || "";
          const price = product.querySelector(".card-body .sp-text")?.innerText || product.querySelector(".card-body .pr-text")?.innerText;
          const discount = product.querySelector(".card-body .fs-text")?.innerText || "";
          const productDetailsLink = product.querySelector(".image-box a")?.getAttribute("href") || "";

          return {
            imageUrl,
            title,
            price,
            discount: discount ? discount.replace(/Save\s*Tk\s*(\d+)/gi, "Save $1৳") : "",
            productDetailsLink,
            company: "Ryans"
          };
        }),
      }
    });

    products.data = products.data.map(p => ({
      ...p,
      price: parsePrice(p.price),
    }));

    return products.data;
  } catch (error) {
    console.log("getRyansSearchedProducts:", error)
    return null
  }
}

export const getRyansSearchedProductDetails = async (productDetailsLink) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();

    // const productDetailsLink = `https://www.ryans.com/${url}`
    await safeGoto(page, productDetailsLink);

    const product = await page.evaluate(() => {
      const productInfo = document.querySelector(".product-info-section");

      const imageUrls = productInfo && [...productInfo.querySelectorAll(".thumbnail-container img")].map(img => img.src) || [];
      const title = productInfo && productInfo.querySelector(".product_content h1")?.innerText?.trim()?.split("\n")?.[0] || "";
      const reviews = productInfo && productInfo.querySelector(".product_content .review-link")?.innerText || "";
      const productId = productInfo && productInfo.querySelector(".product_content .col-lg-7 p")?.innerText || "";
      const specialPrice = productInfo && productInfo.querySelector(".product_content .new-sp-text")?.innerText || "";
      const regularPrice = productInfo && productInfo.querySelector(".product_content .new-reg-text")?.innerText || "";

      const specifications = document.querySelector("#add-spec-div");

      const attributeTitles = specifications && [...specifications.querySelectorAll(".att-title")].map(tag => tag.innerText) || [];
      const attributeValues = specifications && [...specifications.querySelectorAll(".att-value")].map(tag => tag.innerText) || [];
      const attributes = attributeTitles.map((title, index) => ({
        [title]: attributeValues[index] || null
      }));

      return {
        imageUrls,
        title,
        reviews,
        productId: productId.split(":")[1]?.trim(),
        company: "Ryans",
        specialPrice,
        regularPrice,
        attributes: { ...Object.assign({}, ...Object.values(attributes)) }
      }
    });


    browser.close();

    product.regularPrice = parsePrice(product.regularPrice);
    product.specialPrice = parsePrice(product.specialPrice);

    return { ...product, productDetailsLink };
  } catch (error) {
    console.log("getRyansSearchedProductDetails:", error)
    return null;
  }
}