import { Router } from "express";
import { getSearchedProductDetails, getSearchedProducts } from "../controllers/products.controller.js";

const productRoute = Router();

productRoute.route("/:searchKey/:currentPage").get(getSearchedProducts);
productRoute.route("/:url").get(getSearchedProductDetails);

export { productRoute };