import { Router } from "express";
import { isAuthenticated, login, logout } from "../controllers/auth.controller.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js"

const authRoute = Router();

authRoute.route("/login").post(login);
authRoute.route("/check-auth").get(isAuthenticated);
authRoute.route("/logout").get(sessionMiddleware, logout);

export { authRoute };