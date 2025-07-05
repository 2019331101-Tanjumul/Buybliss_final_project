import { parsePrice } from "./converter.js";
import { launchBrowser } from "./puppeteer-browser.js";
import { safeGoto } from "./safe-goto.js";

export const getUCCSearchedProducts = async (page, searchKey = "", currentPage = 1) => {
  try {
    const url = `https://www.ucc.com.bd/index.php?route=product/search&search=${searchKey}&page=${currentPage}`;
    // const url = `https://www.ucc.com.bd/index.php?route=product/search&search=keyboard&page=2`;
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
            company: "UCC"
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
    console.log("getUCCSearchedProducts:", error);
    return null;
  }
}

export const getUCCSearchedProductDetails = async (productDetailsLink) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    // const url = 'thermaltake-w1-wireless-cherry-mx-blue-gaming-keyboard';

    // const productDetailsLink = `https://www.ucc.com.bd/${url}`
    await safeGoto(page, productDetailsLink);


    const product = await page.evaluate(() => {
      const productInfo = document.querySelector(".product-info");
      const imageUrls = productInfo && [...productInfo.querySelectorAll(".swiper-slide img")].map(img => img.src) || [];
      const title = productInfo && productInfo.querySelector("#product .title")?.innerText?.trim()?.split("\n")?.[0] || "";
      const reviews = productInfo && productInfo.querySelector(".review-links a")?.innerText || "";
      const productId = productInfo && productInfo.querySelector(".product-sku span")?.innerText || "";
      const specialPrice = "";
      const regularPrice = productInfo && productInfo.querySelector(".product-right .product-price")?.innerText || ""
      const brand = productInfo && productInfo.querySelector(".product-manufacturer a")?.innerText || "";


      const specifications = document.querySelector("#tab-specification table");

      const attributeTitles = specifications ? [...specifications.querySelectorAll("tbody tr td:first-child")].map(tag => tag?.innerText) : [];

      const attributeValues = specifications ? [...specifications.querySelectorAll("tbody tr td:last-child")].map(tag => tag.innerText) : [];


      const attributes = attributeTitles ? attributeTitles.map((title, index) => ({
        [title]: attributeValues[index] || null
      })) : {};

      return {
        imageUrls,
        title,
        reviews,
        productId,
        company: "UCC",
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
    console.log("getUCCSearchedProductDetails:", error)
  }
}