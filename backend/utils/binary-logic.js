import { parsePrice } from "./converter.js";
import { launchBrowser } from "./puppeteer-browser.js";
import { safeGoto } from "./safe-goto.js";

export const getBinaryLogicSearchedProducts = async (page, searchKey = "", currentPage = 1) => {
  try {
    const url = `https://www.binarylogic.com.bd/search/${searchKey}?page=${currentPage}`;
    const success = await safeGoto(page, url);
    if (!success) return [];


    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".p-item-inner");

      return {
        data: Array.from(productElements).map((product) => {
          const imageUrl = product.querySelector(".p-item-img img")?.getAttribute("src") || "";
          const title = product.querySelector(".p-item-details .p-item-name a")?.innerText;
          const price = product.querySelector(".p-item-price .current_price")?.innerText || product.querySelector(".p-item-price .old_price")?.innerText;
          const discount = product.querySelector(".mark")?.innerText || "";
          const productDetailsLink = product.querySelector(".p-item-img a")?.getAttribute("href") || "";


          return {
            imageUrl,
            title,
            price,
            discount,
            productDetailsLink,
            company: "BinaryLogic"
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
    console.log("getBinaryLogicSearchedProducts:", error);
    return null;
  }
}

export const getBinaryLogicSearchedProductDetails = async (productDetailsLink) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    // const productDetailsLink = `https://www.binarylogic.com.bd/${url}`

    await safeGoto(page, productDetailsLink);


    const product = await page.evaluate(() => {
      const productInfo = document.querySelector(".product_details");
      const imageUrls = productInfo && [...productInfo.querySelectorAll(".thumbnails li img")].map(img => img.src) || [];
      const smallButtons = productInfo && [...productInfo.querySelectorAll(".product-small-buttons")].flatMap(elem => elem.innerText.split("\n")).filter(text => text.trim()) || [];
      const title = productInfo && productInfo.querySelector(".product_d_right form h1")?.innerText?.trim()?.split("\n")?.[0] || "";
      const reviews = ""
      const productId = smallButtons.length >= 5 ? smallButtons[3] : smallButtons[1] || "";
      const specialPrice = smallButtons.length >= 5 ? smallButtons[1] : "";
      const regularPrice = smallButtons.length >= 5 ? smallButtons[2] : "";


      const specifications = document.querySelector(".product_d_inner table");

      const attributeTitles = specifications && [...specifications.querySelectorAll("tbody tr td:first-child")].map(tag => tag.innerText);
      const attributeValues = specifications && [...specifications.querySelectorAll("tbody tr td:last-child")].map(tag => tag.innerText);
      const attributes = attributeTitles ? attributeTitles.map((title, index) => ({
        [title]: attributeValues[index] || null
      })) : {};

      return {
        imageUrls,
        title,
        reviews,
        productId,
        company: "BinaryLogic",
        specialPrice,
        regularPrice,
        attributes: {
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
    console.log("getBinaryLogicSearchedProductDetails:", error)
  }
}