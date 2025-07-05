import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateRandomSalt, hashPassword, verifyPassword } from "../utils/auth.js";
import { sendVerificationEmail } from "../utils/send-email.js";
import { createSession } from "../utils/session.js";
import crypto from "crypto";

export async function signup(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json(new ApiResponse(400, { error: "All fields are required" }, "Bad request"));
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(401).json(new ApiResponse(401, { error: "Invalid credentials" }, "Signup failed"));
    }

    const salt = generateRandomSalt();
    const hashedPassword = await hashPassword(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);
    user = await User.create({ email: email, salt: salt, hashedPassword: hashedPassword, verificationToken, verificationTokenExpires: expires });
    if (!user) {
      return res.status(500).json(new ApiResponse(500, { error: "Unable to create user" }, "Internal server error"));
    }

    const isSessionCreated = await createSession(user._id, res);
    if (!isSessionCreated) {
      return res.status(500).json(new ApiResponse(500, { error: "Unable to create session" }, "Internal server error"));
    }

    await sendVerificationEmail(email, `http://localhost:5173/verify-email?token=${verificationToken}`);

    user.hashedPassword = undefined;
    user.salt = undefined;
    return res.status(201).json(new ApiResponse(201, { user: user }, "User created successfully"));
  } catch (error) {
    console.log("signup error:", error);
    return res.status(error.status || 500).json(new ApiResponse(error.status || 500, {}, error.message || "Internal server error"));
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const userId = req.userId;

    if (!token) {
      return res.status(400).json(new ApiResponse(400, { error: "Verification token is required" }));
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json(new ApiResponse(400, { error: "Invalid or expired token" }));
    }

    if (user._id.toString() !== userId.toString()) {
      return res.status(400).json(new ApiResponse(400, { error: "Invalid token" }));
    }

    if (user.verificationTokenExpires < new Date()) {
      return res.status(400).json(new ApiResponse(400, { error: "Token has expired" }));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json(new ApiResponse(200, { message: "Email verified successfully!" }));
  } catch (err) {
    console.error("verifyEmail error:", err);
    return res.status(500).json(new ApiResponse(500, { error: "Internal server error" }));
  }
}

export async function resendVerificationEmail(req, res) {
  try {
    const user = User.findById(req.userId);

    if (!user) {
      return res.status(404).json(new ApiResponse(404, { error: "User not found" }));
    }

    if (user.isVerified) {
      return res.status(400).json(new ApiResponse(400, { error: "User is already verified" }));
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.verificationToken = token;
    user.verificationTokenExpires = expires;
    await user.save();

    await sendVerificationEmail(email, `http://localhost:5173/verify-email?token=${token}`);

    return res.status(200).json(new ApiResponse(200, { message: "Verification email resent" }));
  } catch (err) {
    console.error("resendVerificationEmail error:", err);
    return res.status(500).json(new ApiResponse(500, { error: "Internal server error" }));
  }
}



export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json(new ApiResponse(400, { error: "All fields are required" }, "Bad request"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json(new ApiResponse(401, { error: "Invalid credentials" }, "Login failed"));
    }

    const isPasswordVerified = await verifyPassword(user.hashedPassword, password, user.salt)
    if (!isPasswordVerified) {
      return res.status(401).json(new ApiResponse(401, { error: "Invalid credentials" }, "Login failed"));
    }

    const isSessionCreated = await createSession(user._id, res);
    if (!isSessionCreated) {
      return res.status(500).json(new ApiResponse(500, { error: "Unable to create session" }, "Internal server error"));
    }

    if (!user.isVerified) {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      user.verificationToken = verificationToken;
      const expires = new Date(Date.now() + 1000 * 60 * 60);
      user.verificationTokenExpires = expires;
      await sendVerificationEmail(email, `http://localhost:5173/verify-email?token=${verificationToken}`);
      await user.save();
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
    const sessionId = req.cookies?.session_id;

    if (!sessionId) {
      return res.status(400).json(new ApiResponse(400, { error: "No session found" }, "Bad request"));
    }

    await Session.deleteOne({ sessionId });
    res.clearCookie("session_id");

    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
  } catch (error) {
    console.error("logout error:", error);
    return res.status(error.status || 500).json(new ApiResponse(500, {}, error.message || "Internal server error"));
  }
}
