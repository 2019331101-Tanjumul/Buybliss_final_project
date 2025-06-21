import nodemailer from "nodemailer"
import { WishItem } from "../models/wishlist.model.js";
import { findProductDetails } from "./find-product-details.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// These 2 lines get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the env file from backend/config/.env
dotenv.config({
  path: path.resolve(__dirname, "../config/.env"),
  debug: true
});


// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS // Use App Password if 2FA is enabled
  }
});



export async function checkWishlistAndSendEmail() {
  const wishItems = await WishItem.find({})
  for (const item of wishItems) {
    const product = await findProductDetails(item.productDetailsLink)
    const price = product.specialPrice ? product.specialPrice : product.regularPrice;
    if (item.price - price > 0) {
      const mailOptions = {
        from: 'crackerroot4@gmail.com',
        to: item.email,
        subject: 'Price Dropped',
        text: `Price dropped for product ${product.productDetailsLink} by ${item.price - price} ৳`
      };

      // Send the email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
  }
}