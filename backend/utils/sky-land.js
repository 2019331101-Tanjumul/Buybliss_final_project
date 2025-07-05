import { parsePrice } from "./converter.js";
import { launchBrowser } from "./puppeteer-browser.js";
import { safeGoto } from "./safe-goto.js";

export const getSkyLandSearchedProducts = async (page, searchKey = "", currentPage = 1) => {
  try {
    const url = `https://www.skyland.com.bd/index.php?route=product/search&search=${searchKey}&page=${currentPage}`;
    const success = await safeGoto(page, url);
    if (!success) return [];


    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".product-thumb");

      return {
        data: Array.from(productElements).map((product) => {
          const imageUrl = product.querySelector(".image img")?.getAttribute("src") || "";
          const title = product.querySelector(".caption .name a")?.innerText;
          const price = product.querySelector(".price .price-new")?.innerText || product.querySelector(".price .price-normal")?.innerText || product.querySelector(".price .price-old")?.innerText;
          const discount = product.querySelector(".product-label")?.innerText || "";
          const productDetailsLink = product.querySelector(".product-img")?.getAttribute("href").split("?")[0] || "";


          return {
            imageUrl,
            title,
            price,
            discount,
            productDetailsLink,
            company: "SkyLandBD"
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
    console.log("getSkyLandSearchedProducts:", error);
    return null;
  }
}

export const getSkyLandSearchedProductDetails = async (productDetailsLink) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    // const url = 'corsair-k100-air-gaming-keyboard';
    // const url = 'cooler-master-ck350-rgb-mechanical-gaming-keyboard';
    // const url = 'casio-ct-s100-casiotone-portable-keyboard';
    // const url = 'corsair-k100-air-gaming-keyboard';

    // const productDetailsLink = `https://www.skyland.com.bd/${url}`
    await safeGoto(page, productDetailsLink);


    const product = await page.evaluate(() => {
      const productInfo = document.querySelector(".product-info");
      const imageUrls = productInfo && [...productInfo.querySelectorAll(".swiper-slide img")].map(img => img.src) || [];
      const title = productInfo && productInfo.querySelector("#product .title")?.innerText?.trim()?.split("\n")?.[0] || "";
      const reviews = productInfo && productInfo.querySelector(".review-links a")?.innerText || "";
      const productId = productInfo && productInfo.querySelector(".short-info .product-model:last-child span:last-child")?.innerText || "";
      const specialPrice = productInfo && productInfo.querySelector(".short-info .product-data:first-child span:last-child")?.innerText || "";
      const regularPrice = productInfo && productInfo.querySelector(".short-info .product-data:nth-child(2) span:last-child")?.innerText || ""
      const brand = productInfo && productInfo.querySelector(".product-manufacturer a")?.innerText || "";


      const specifications = document.querySelector("#tab-specification table") || document.querySelector(".product_overview table") || document.querySelector(".block-content table");
      const listSpecifications = document.querySelector(".block-content > ul");
      const description = document.querySelector(".block-content > div > div:nth-child(2)");

      const attributeTitles = specifications ? [...specifications.querySelectorAll("tbody tr td:first-child")].map(tag => tag?.innerText) : listSpecifications ? [...listSpecifications.querySelectorAll("li")].flatMap(tag => tag?.innerText.split(":")[0]) : description ? [...description.querySelectorAll(":scope > div")].flatMap((tag) => tag.innerText.split("\n")).filter((_, index) => index % 2 === 0) : [];

      const attributeValues = specifications ? [...specifications.querySelectorAll("tbody tr td:last-child")].map(tag => tag.innerText) : listSpecifications ? [...listSpecifications.querySelectorAll("li")].flatMap(tag => tag?.innerText.split(":")[1]) : description ? [...description.querySelectorAll("ul li")].map(tag => tag?.innerText) : [];


      const attributes = attributeTitles ? attributeTitles.map((title, index) => ({
        [title]: attributeValues[index] || null
      })) : {};

      return {
        imageUrls,
        title,
        reviews,
        productId,
        company: "SkyLandBD",
        specialPrice,
        regularPrice,
        attributes: {
          ...Object.assign({ Brand: brand }, ...Object.values(attributes))
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
    console.log("getSkyLandSearchedProductDetails:", error)
  }
}