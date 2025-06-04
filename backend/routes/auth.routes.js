import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.route("/login").post(login);
authRoute.route("/logout").get(logout);

export { authRoute };