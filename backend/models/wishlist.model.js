import mongoose from "mongoose";

const wishItemSchema = new mongoose.Schema({
  productDetailsLink: { type: String, required: true },
  company: { type: String, required: true },
  price: { type: Number, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const WishItem = mongoose.model("WishItem", wishItemSchema);
