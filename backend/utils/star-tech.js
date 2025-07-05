import { parsePrice } from "./converter.js";
import { launchBrowser } from "./puppeteer-browser.js";
import { safeGoto } from "./safe-goto.js";

export const getStarTechSearchedProducts = async (page, searchKey = "", currentPage = 1) => {
  try {

    const url = `https://www.startech.com.bd/product/search?search=${searchKey}&page=${currentPage}`;
    const success = await safeGoto(page, url);
    if (!success) return [];


    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".p-item-inner");

      return {
        data: Array.from(productElements).map((product) => {
          const imageUrl = product.querySelector(".p-item-img img")?.getAttribute("src") || "";
          const title = product.querySelector(".p-item-name a").innerText;
          const price = product.querySelector(".p-item-price .price-new")?.innerText || product.querySelector(".p-item-price")?.innerText;
          const discount = product.querySelector(".mark")?.innerText || "";
          const productDetailsLink = product.querySelector(".p-item-img a")?.getAttribute("href") || "";


          return {
            imageUrl,
            title,
            price,
            discount,
            productDetailsLink,
            company: "StarTech"
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
    console.log("getStarTechSearchedProducts:", error);
    return null;
  }
}

export const getStarTechSearchedProductDetails = async (productDetailsLink) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();

    // const productDetailsLink = `https://www.startech.com.bd/${url}`
    await safeGoto(page, productDetailsLink);


    const product = await page.evaluate(() => {
      const productInfo = document.querySelector(".product-details-summary");
      const imageUrls = productInfo && [...productInfo.querySelectorAll(".product-images img")].map(img => img.src) || [];
      const title = productInfo && productInfo.querySelector(".product-name")?.innerText?.trim()?.split("\n")?.[0] || "";
      const reviews = productInfo && document.querySelector(".review h2")?.innerText || "";
      const productId = productInfo && productInfo.querySelector(".product-code")?.innerText || "";
      const specialPrice = productInfo && productInfo.querySelector(".product-price")?.innerText || "";
      const regularPrice = productInfo && productInfo.querySelector(".product-regular-price")?.innerText || "";

      const shortSpecifications = document.querySelector(".short-description");
      const shortAttributes = shortSpecifications &&
        [...shortSpecifications.querySelectorAll("ul li:not(:last-child)")]
          .map(tag => tag.innerText)
          .map(item => {
            if (item.includes(':')) {
              const [key, value] = item.split(':').map(str => str.trim());
              return { [key]: value };
            }
            return null;
          })
          .filter(Boolean) || [];


      const specifications = document.querySelector("#specification");

      const attributeTitles = specifications && [...specifications.querySelectorAll("td.name")].map(tag => tag.innerText) || [];
      const attributeValues = specifications && [...specifications.querySelectorAll("td.value")].map(tag => tag.innerText) || [];
      const attributes = attributeTitles.map((title, index) => ({
        [title]: attributeValues[index] || null
      }));

      return {
        imageUrls,
        title,
        reviews,
        productId,
        company: "StarTech",
        specialPrice,
        regularPrice,
        attributes: {
          ...Object.assign({}, ...Object.values(shortAttributes)),
          ...Object.assign({}, ...Object.values(attributes))
        },
      }
    });


    browser.close();

    const regex = product.reviews.match(/\((\d+)\)/);
    const reviewCount = regex ? parseInt(regex[1], 10) : 0;

    product.reviews = `${reviewCount} reviews`
    product.regularPrice = parsePrice(product.regularPrice);
    product.specialPrice = parsePrice(product.specialPrice);

    return { ...product, productDetailsLink };
  } catch (error) {
    console.log("getStarTechSearchedProductDetails:", error)
  }
}