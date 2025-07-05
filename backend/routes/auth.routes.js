import { Router } from "express";
import { login, logout, resendVerificationEmail, signup, verifyEmail } from "../controllers/auth.controller.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js"

const authRoute = Router();

authRoute.route("/signup").post(signup);
authRoute.route("/verify-email").get(sessionMiddleware, verifyEmail);
authRoute.route("/resend-verification").post(sessionMiddleware, resendVerificationEmail);
authRoute.route("/login").post(login);
authRoute.route("/logout").get(sessionMiddleware, logout);

export { authRoute };