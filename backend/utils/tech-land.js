import { parsePrice } from "./converter.js";
import { launchBrowser } from "./puppeteer-browser.js";
import { safeGoto } from "./safe-goto.js";

export const getTechLandSearchedProducts = async (page, searchKey = "", currentPage = 1) => {
  try {
    const url = `https://www.techlandbd.com/search/advance/product/result/${searchKey}?page=${currentPage}`

    const success = await safeGoto(page, url);
    if (!success) return [];


    const products = await page.evaluate(() => {
      const productElements = document.querySelector(".grid").querySelectorAll(".bg-white");

      return {
        data: Array.from(productElements).map((product) => {
          const imageUrl = product.querySelector("img")?.getAttribute("src") || "";
          const title = product.querySelector("a.font-semibold")?.innerText;
          const price = product.querySelector(".text-lg.font-bold")?.innerText || product.querySelector(".text-sm.line-through")?.innerText;
          const discount = product.querySelector(".absolute")?.innerText || "";
          const productDetailsLink = product.querySelector("a")?.getAttribute("href") || "";


          return {
            imageUrl,
            title,
            price,
            discount,
            productDetailsLink,
            company: "TechLandBD"
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
    console.log("getTechLandSearchedProducts:", error);
    return null;
  }
}

export const getTechLandSearchedProductDetails = async (productDetailsLink) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();

    // const productDetailsLink = 'https://www.techlandbd.com/logitech-k120-and-b100-combo'

    await safeGoto(page, productDetailsLink);


    const product = await page.evaluate(() => {
      const productInfo = document.querySelector("main > div > div:nth-child(2)");
      const imageUrls = productInfo && [...productInfo.querySelectorAll("#main-image")].map(img => img.src) || [];
      const title = productInfo && productInfo.querySelector("h1")?.innerText?.trim()?.split("\n")?.[0] || "";
      const reviews = "";
      const specialPrice = productInfo && productInfo.querySelector(".text-xs.line-through")?.innerText ? productInfo && productInfo.querySelector(".text-lg.font-bold")?.innerText : "";
      const regularPrice = productInfo && productInfo.querySelector(".text-xs.line-through")?.innerText || productInfo && productInfo.querySelector(".text-lg.font-bold")?.innerText || "";


      const specifications = document.querySelector("#specification-tab > div > table")
      const descriptions = document.querySelector("#description-tab > div > table:nth-child(2)")

      const attributeTitles = specifications ? [...specifications.querySelectorAll("tbody tr.bg-gray-50 td:first-child")].map(tag => tag.innerText) : descriptions ? [...descriptions.querySelectorAll("tbody tr td:first-child")].map(tag => tag.innerText) : [];
      const attributeValues = specifications ? [...specifications.querySelectorAll("tbody tr.bg-gray-50 td:last-child")].map(tag => tag.innerText) : descriptions ? [...descriptions.querySelectorAll("tbody tr td:last-child")].map(tag => tag.innerText) : []
      const attributes = attributeTitles?.map((title, index) => ({
        [title]: attributeValues[index] || null
      }));

      return {
        imageUrls,
        title,
        reviews,
        company: "TechLandBD",
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
    console.log("getTechLandSearchedProductDetails:", error)
  }
}