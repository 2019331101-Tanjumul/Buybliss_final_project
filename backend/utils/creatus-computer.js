import { parsePrice } from "./converter.js";
import { launchBrowser } from "./puppeteer-browser.js";
import { safeGoto } from "./safe-goto.js";

export const getCreatusComputerSearchedProducts = async (page, searchKey = "", currentPage = 1) => {
  try {
    const url = `https://www.creatus.com.bd/index.php?route=product/search&search=${searchKey}&page=${currentPage}`;
    // const url = `https://www.creatus.com.bd/index.php?route=product/search&search=keyboard&page=1`;

    const success = await safeGoto(page, url);
    if (!success) return [];


    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".product-thumb");

      return {
        data: Array.from(productElements).map((product) => {
          const img = product.querySelector(".image img");
          const imageUrl = img?.getAttribute("data-src") || img?.getAttribute("src") || "";
          const title = product.querySelector(".caption .name a")?.innerText;
          console.log(title, ":", imageUrl)
          const price = product.querySelector(".price .price-new")?.innerText || product.querySelector(".price .price-normal")?.innerText || product.querySelector(".price .price-old")?.innerText;
          const discount = product.querySelector(".product-label")?.innerText || "";
          const productDetailsLink = product.querySelector(".product-img")?.getAttribute("href").split("?")[0] || "";


          return {
            imageUrl,
            title,
            price,
            discount,
            productDetailsLink,
            company: "CreatusComputerBD"
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
    console.log("getCreatusComputerSearchedProducts:", error);
    return null;
  }
}

export const getCreatusComputerSearchedProductDetails = async (productDetailsLink) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    // const url = 'thermaltake-w1-wireless-cherry-mx-blue-gaming-keyboard';

    // const productDetailsLink = `https://www.creatus.com.bd/xinmeng-beat65-wired-8k-hz-low-latency-magnetic-switch-mechanical-keyboard`
    // const productDetailsLink = `https://www.creatus.com.bd/fantech-atom81-mk875v2-keyboard`

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


      const specifications = document.querySelector("#tab-specification table") || document.querySelector(".block-description table");

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
        company: "CreatusComputerBD",
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
    console.log("getCreatusComputerSearchedProductDetails:", error)
  }
}