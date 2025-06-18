import { ApiResponse } from "../utils/ApiResponse.js";
import { getRyansSearchedProductDetails, getRyansSearchedProducts } from "../utils/ryans.js";
import { getStarTecSearchedProductDetails, getStarTecSearchedProducts } from "../utils/star-tech.js";


export const getSearchedProducts = async (req, res) => {
  try {
    const { searchKey, currentPage } = req.params;
    if (!searchKey) {
      res.status(400).json({ message: "Search key is required" })
      return;
    }
    const ryansSearchedProducts = await getRyansSearchedProducts(searchKey, currentPage);
    const starTechSearchedProducts = await getStarTecSearchedProducts(searchKey, currentPage);

    const products = [...ryansSearchedProducts, ...starTechSearchedProducts]

    res.status(200).json(new ApiResponse(200, products))
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}

export const getSearchedProductDetails = async (req, res) => {
  try {
    const { url } = req.params;
    if (!url) {
      return res.status(400).json({ message: "Url is required" })
    }
    const ryansProductDetails = await getRyansSearchedProductDetails(url);
    const starTechProductDetails = await getStarTecSearchedProductDetails(url);
    const productDetails = ryansProductDetails.title ? ryansProductDetails : starTechProductDetails;

    return res.status(200).json(new ApiResponse(200, productDetails));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}