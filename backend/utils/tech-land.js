import puppeteerExtra from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import { parsePrice } from "./converter.js";

puppeteerExtra.use(Stealth())

export const getTechLandSearchedProducts = async (searchKey = "", currentPage = 1) => {
  try {
    const browser = await puppeteerExtra.launch();
    const page = await browser.newPage();

    const url = `https://www.techlandbd.com/index.php?route=product/search&search=${searchKey}&page=${currentPage}`;
    await page.goto(url, { timeout: 60000, waitUntil: "domcontentloaded" });


    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".product-thumb");

      return {
        data: Array.from(productElements).map((product) => {
          const imageUrl = product.querySelector(".product-img img")?.getAttribute("src") || "";
          const title = product.querySelector(".caption .name a").innerText;
          const price = product.querySelector(".caption .price .price-new")?.innerText || product.querySelector(".caption .price .price-old")?.innerText || product.querySelector(".caption .price .price-normal")?.innerText;
          const discount = product.querySelector(".mark")?.innerText || "";
          const productDetailsLink = product.querySelector(".product-img")?.getAttribute("href") || "";


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

export const getTechLandSearchedProductDetails = async (url) => {
  try {
    const browser = await puppeteerExtra.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.techlandbd.com/${url}`, { timeout: 60000, waitUntil: "domcontentloaded" });


    const product = await page.evaluate(() => {
      const productInfo = document.querySelector(".product-info");
      const imageUrls = productInfo && [...productInfo.querySelectorAll(".product-left .product-image img")].map(img => img.src) || [];
      const title = productInfo && productInfo.querySelector("#product .title")?.innerText?.trim()?.split("\n")?.[0] || "";
      const reviews = productInfo && productInfo.querySelector("table tbody:last-child tr:last-child td:last-child")?.innerText || "";
      const productId = productInfo && productInfo.querySelector("table tbody:last-child tr:nth-child(4) td:last-child")?.innerText || "";
      const specialPrice = productInfo && productInfo.querySelector("table tbody:last-child tr:nth-child(2) td:last-child")?.innerText || "";
      const regularPrice = productInfo && productInfo.querySelector("table tbody:last-child tr:nth-child(1) td:last-child")?.innerText || "";


      const specifications = document.querySelector(".block-attributes table");
      const tables = document.querySelector(".block-description")
      console.log("specifications:", specifications)
      const descriptions = tables?.querySelectorAll("table")?.[1]

      const attributeTitles = specifications ? [...specifications.querySelectorAll(".attribute-name")].map(tag => tag.innerText) : descriptions ? [...descriptions.querySelectorAll("tbody tr td:first-child")].map(tag => tag.innerText) : [];
      console.log("titles:", attributeTitles);
      const attributeValues = specifications ? [...specifications.querySelectorAll(".attribute-value")].map(tag => tag.innerText) : descriptions ? [...descriptions.querySelectorAll("tbody tr td:last-child")].map(tag => tag.innerText) : []
      console.log("values:", attributeValues);
      const attributes = attributeTitles?.map((title, index) => ({
        [title]: attributeValues[index] || null
      }));

      return {
        imageUrls,
        title,
        reviews,
        productId,
        company: "TechLandBD",
        specialPrice,
        regularPrice,
        attributes: {
          ...Object.assign({}, ...Object.values(attributes))
        },
      }
    });


    // await browser.close();

    const regex = product.reviews.match(/\((\d+)\)/);
    const reviewCount = regex ? parseInt(regex[1], 10) : 0;

    product.reviews = `${reviewCount} reviews`
    product.regularPrice = parsePrice(product.regularPrice);
    product.specialPrice = parsePrice(product.specialPrice);

    return { ...product, productDetailsLink: `https://www.techlandbd.com/${url}` };
  } catch (error) {
    console.log("getStarTecSearchedProductDetails:", error)
  }
}