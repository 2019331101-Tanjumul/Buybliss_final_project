import puppeteerExtra from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import { parsePrice } from "./converter.js";

puppeteerExtra.use(Stealth())

export const getStarTecSearchedProducts = async (searchKey = "", currentPage = 1) => {
  try {
    const browser = await puppeteerExtra.launch();
    const page = await browser.newPage();

    const url = `https://www.startech.com.bd/product/search?search=${searchKey}&page=${currentPage}`;
    await page.goto(url, { timeout: 60000, waitUntil: "domcontentloaded" });


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


    await browser.close();

    products.data = products.data.map(p => ({
      ...p,
      price: parsePrice(p.price),
    }));

    return products.data;
  } catch (error) {
    console.log("getStarTecSearchedProducts:", error);
    return null;
  }
}

export const getStarTecSearchedProductDetails = async (url) => {
  try {
    const browser = await puppeteerExtra.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.startech.com.bd/${url}`, { timeout: 60000, waitUntil: "domcontentloaded" });


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


    await browser.close();

    const regex = product.reviews.match(/\((\d+)\)/);
    const reviewCount = regex ? parseInt(regex[1], 10) : 0;

    product.reviews = `${reviewCount} reviews`
    product.regularPrice = parsePrice(product.regularPrice);
    product.specialPrice = parsePrice(product.specialPrice);

    return { ...product, productDetailsLink: `https://www.startech.com.bd/${url}`  };
  } catch (error) {
    console.log("getStarTecSearchedProductDetails:", error)
  }
}