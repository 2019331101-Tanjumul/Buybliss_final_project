import { Router } from "express";
import { getCurrentUser } from "../controllers/users.controller.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js"

const userRoute = Router();

userRoute.route("/current-user").get(sessionMiddleware, getCurrentUser);

export { userRoute };