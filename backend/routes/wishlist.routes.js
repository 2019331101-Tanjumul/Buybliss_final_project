import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const wishlistRoute = Router();

wishlistRoute.post("/add", sessionMiddleware, addToWishlist);
wishlistRoute.get("/:email", sessionMiddleware, getWishlist);
wishlistRoute.delete("/:email/:productDetailsLink", sessionMiddleware, removeFromWishlist);

export { wishlistRoute };
