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

export async function sendVerificationEmail(email, verifyUrl) {
  const mailOptions = {
    from: 'crackerroot4@gmail.com',
    to: email,
    subject: "Verify your email",
    html: `
    <p style="color: #2a9d8f;">Thanks for signing up!</p>

<p>
BuyBliss Email Verification <br><br>

Hi there,<br>

We noticed a login attempt to your BuyBliss account. If that was you, please click the button or link below to verify your email address:<br>

To verify your email  <p>Click <a href="${verifyUrl}">here</a> to verify your email.</p><br>

If you did not try to log in, we recommend updating your password to keep your account secure.<br>

Need help? Visit our Help Center to learn more about account verification and security.<br><br>

Best regards,<br>
The BuyBliss Team 
<p>

   
  `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


export async function checkWishlistAndSendEmail() {
  const wishItems = await WishItem.find({});
  
  for (const item of wishItems) {
    const product = await findProductDetails(item.productDetailsLink, item.company);
    const currentPrice = product.specialPrice ? product.specialPrice : product.regularPrice;
    const priceDrop = item.price - currentPrice;

    if (priceDrop > 0) {
      const mailOptions = {
        from: 'crackerroot4@gmail.com',
        to: item.email,
        subject: 'Price Drop Alert! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2 style="color: #2a9d8f;">Good news!</h2>
            <p>The product you wishlisted has an dropped in price.</p>
            
            <h3 style="margin-bottom: 5px;">${product.title || "A product you're interested in"}</h3>
            <p>
              
              <strong>Current Price :</strong> ৳${currentPrice.toLocaleString()}<br>
              <strong>You Save:</strong> <span style="color: #e63946;">৳${priceDrop.toLocaleString()}</span>
            </p>

            <a href="${product.productDetailsLink}" style="display: inline-block; background-color: #2a9d8f; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Product</a>

            <p style="margin-top: 20px;">Don't miss out—this deal may not last long!</p>
            <p>–buybliss Team</p>
          </div>
        `
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Price drop email sent to', item.email, ':', info.response);
        }
      });
    }
  }
}
