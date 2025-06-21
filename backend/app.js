import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { productRoute } from './routes/product.routes.js';
import { authRoute } from './routes/auth.routes.js';
import { userRoute } from './routes/user.routes.js';
import { wishlistRoute } from './routes/wishlist.routes.js';

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/products", productRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/wishlist", wishlistRoute);
app.use("/wishlist", wishlistRoute);

export default app;