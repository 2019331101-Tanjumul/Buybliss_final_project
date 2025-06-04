import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateRandomSalt, hashPassword, verifyPassword } from "../utils/auth.js";
import { createSession } from "../utils/session.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
    }

    let user = await User.findOne({ email });

    if (!user) {
      const salt = generateRandomSalt();
      const hashedPassword = await hashPassword(password, salt);
      user = await User.create({ email: email, salt: salt, hashedPassword: hashedPassword });
      if (!user) {
        return res.status(401).json(new ApiResponse(400, {}, "Unable to create user"));
      }
    } else {
      const isPasswordVerified = await verifyPassword(user.hashedPassword, password, user.salt)
      if (!isPasswordVerified) {
        return res.status(401).json(new ApiResponse(401, {}, "Invalid credentials"));
      }
    }

    const isSessionCreated = await createSession(user._id, res);
    if (!isSessionCreated) {
      return res.status(401).json(new ApiResponse(400, {}, "Unable to create session"));
    }

    user.hashedPassword = undefined;
    user.salt = undefined;
    return res.status(200).json(new ApiResponse(200, { user: user }, "Logged in successfully"));
  } catch (error) {
    console.log("login error:", error);
    return res.status(error.status || 500).json(new ApiResponse(error.status || 500, {}, error.message || "Internal server error"));
  }
}

export async function logout(req, res) {
  try {
    const sessionId = req.cookies.session_id;

    if (!sessionId) {
      return res.status(400).json(new ApiResponse(400, {}, "No session found"));
    }

    await Session.deleteOne({ sessionId });
    res.clearCookie("session_id");

    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
  } catch (error) {
    console.error("logout error:", error);
    return res.status(error.status || 500).json(new ApiResponse(400, {}, error.message || "Internal server error"));
  }
}
