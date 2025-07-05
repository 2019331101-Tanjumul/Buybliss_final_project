// backend/controllers/wishlist.controller.js

import { ApiResponse } from "../utils/ApiResponse.js";
import { WishItem } from "../models/wishlist.model.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productDetailsLink, price, company, email } = req.body;

    if (!productDetailsLink) {
      return res.status(400).json(
        new ApiResponse(400, {}, "ProductDetailsLink is required")
      );
    }

    if (!price) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Price is required")
      );
    }

    if (!company) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Company is required")
      );
    }

    if (!email) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Email is required")
      );
    }

    // Check if item already exists in wishlist
    const existingItem = await WishItem.findOne({ productDetailsLink, email, company });
    if (existingItem) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Item already in wishlist")
      );
    }

    const wishItem = await WishItem.create({
      productDetailsLink,
      company,
      price,
      email
    });

    return res.status(201).json(
      new ApiResponse(201, wishItem, "Item added to wishlist successfully")
    );
  } catch (error) {
    console.error("addToWishlist error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Internal server error")
    );
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Email is required")
      );
    }

    const wishItems = await WishItem.find({ email }).sort({ createdAt: -1 });
    return res.status(200).json(
      new ApiResponse(200, wishItems, "Wishlist fetched successfully")
    );
  } catch (error) {
    console.error("getWishlist error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Internal server error")
    );
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { email, productDetailsLink } = req.params;
    if (!productDetailsLink || !email) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Product details link and email are required")
      );
    }

    const deletedItem = await WishItem.findOneAndDelete({
      productDetailsLink,
      email
    });

    if (!deletedItem) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Item not found in wishlist")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, deletedItem, "Item removed from wishlist successfully")
    );
  } catch (error) {
    console.error("removeFromWishlist error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, error.message || "Internal server error")
    );
  }
};
