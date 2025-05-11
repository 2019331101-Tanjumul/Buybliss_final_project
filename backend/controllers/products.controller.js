import { ApiResponse } from "../utils/ApiResponse.js";
import { getRyansHomeProduct, getRyansSearchedProduct } from "../utils/ryans.js";
import { getStarTechHomeProducts, getStarTecSearchedProducts } from "../utils/star-tech.js";

export const getHomeProducts = async (_, res) => {
  try {
    const ryansHomeProducts = await getRyansHomeProduct();
    const starTechHomeProducts = await getStarTechHomeProducts();

    const products = [...ryansHomeProducts.data, ...starTechHomeProducts.data]

    res.status(200).json(new ApiResponse(200, products))
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}

export const getSearchedProducts = async (req, res) => {
  try {
    const { searchKey } = req.params;
    if (!searchKey) {
      res.status(400).json({ message: "Search key is required" })
      return;
    }
    const ryansSearchedProducts = await getRyansSearchedProduct(searchKey);
    const starTechSearchedProducts = await getStarTecSearchedProducts(searchKey);

    const products = [...ryansSearchedProducts.data, ...starTechSearchedProducts.data]

    res.status(200).json(new ApiResponse(200, products))
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}