import { parsePrice } from "./converter.js";
import { launchBrowser } from "./puppeteer-browser.js";
import { safeGoto } from "./safe-goto.js";

export const getDiamuSearchedProducts = async (page, searchKey = "", currentPage = 1) => {
  try {
    // const url = `https://diamu.com.bd/page/16/?s=monitor&post_type=product`;
    const url = `https://diamu.com.bd/page/${currentPage}/?s=${searchKey}&post_type=product`;
    const success = await safeGoto(page, url);
    if (!success) return [];

    // await page.waitForSelector(".product-small.box", { timeout: 10000 });


    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".product-small.box");

      return {
        data: Array.from(productElements).map((product) => {
          const imageUrl = product.querySelector(".box-image img")?.getAttribute("src") || "";
          const title = product.querySelector(".box-text .name a")?.innerText;
          const price = product.querySelector(".box-text .price ins bdi")?.innerText || product.querySelector(".box-text .price bdi")?.innerText;
          const discount = product.querySelector(".product-labels b")?.innerText || "";
          const productDetailsLink = product.querySelector(".box-image a")?.getAttribute("href").split("?")[0] || "";


          return {
            imageUrl,
            title,
            price,
            discount,
            productDetailsLink,
            company: "Diamu"
          };
        }),
      }
    });

    products.data = products.data.map(p => ({
      ...p,
      price: parsePrice(p.price),
    }));

    // console.log(products.data[0])

    return products.data;
  } catch (error) {
    console.log("getDiamuSearchedProducts:", error);
    return null;
  }
}

export const getDiamuSearchedProductDetails = async (productDetailsLink) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    // const url = 'audio-technica-ath-m60x-headphone';
    // const url = 'zeblaze-gts-smartwatch';
    // const productDetailsLink = `https://diamu.com.bd/product/${url}`

    await safeGoto(page, productDetailsLink);

    // Handle add
    try {
      await page.waitForSelector('.mfp-wrap', { timeout: 1000 });

      const closeBtn = await page.$('button.mfp-close');
      if (closeBtn) {
        await closeBtn.click();
      } else {
        await page.mouse.click(10, 10); // fallback: click empty space
      }

      console.log('Ad was present and dismissed.');
    } catch (e) {
      console.log('No ad appeared.');
    }


    const product = await page.evaluate(() => {
      const productInfo = document.querySelector(".custom-product-page .section");
      const imageUrls = productInfo && [...productInfo.querySelectorAll("img.attachment-woocommerce_thumbnail")]
        .map(img => img.src)
        || [];
      const title = productInfo && productInfo.querySelector(".product-title")?.innerText?.trim()?.split("\n")?.[0] || "";
      const reviews = productInfo && productInfo.querySelector(".product-right .review-links a")?.innerText || "";
      const productId = ""
      const specialPrice = productInfo && productInfo.querySelector(".price ins bdi")?.innerText || "";
      const regularPrice = productInfo && productInfo.querySelector(".price del bdi")?.innerText || productInfo && productInfo.querySelector(".price bdi")?.innerText || "";

      const specifications = document.querySelector(".custom-product-page .section + .section table");
      const listSpecifications = document.querySelector(".product-section") //.spec_div_wrp

      const attributeTitles = specifications ? [...specifications.querySelectorAll("tbody tr td:first-child")].map(tag => tag?.innerText) : listSpecifications ? [...listSpecifications.querySelectorAll("ul li")].flatMap(tag => tag?.innerText.split(":")?.[0]) : [];

      const attributeValues = specifications ? [...specifications.querySelectorAll("tbody tr td:last-child")].map(tag => tag.innerText) : listSpecifications ? [...listSpecifications.querySelectorAll("ul li")].flatMap(tag => tag?.innerText.split(":")?.[1]) : [];


      const attributes = attributeTitles ? attributeTitles.map((title, index) => ({
        [title]: attributeValues[index] || null
      })) : {};

      return {
        imageUrls,
        title,
        reviews,
        productId,
        company: "Diamu",
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
    console.log("getDiamuSearchedProductDetails:", error)
  }
}