import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function getCurrentUser(req, res) {
  try {
    const sessionId = req.cookies?.session_id;
    if (!sessionId) {
      return res.status(403).json(new ApiResponse(403, {}, "Forbidden. Session id not found"));
    }

    const session = await Session.findOne({ sessionId });

    if (!session || session.expiresAt < new Date()) {
      return res.status(403).json(new ApiResponse(403, {}, "Forbidden. Session is expired"));
    }

    const userId = session.userId;
    if (!userId) {
      return res.status(401).json(new ApiResponse(401, { user: null }, "Unauthorized. User id not found"));
    }

    const user = await User.findById(userId).select("-hashedPassword -salt");
    if (!user) {
      return res.status(401).json(new ApiResponse(401, { user: null }, "Unauthorized"));
    }
    return res.status(200).json(new ApiResponse(200, { user }, "Fetched user successfully"));
  } catch (error) {
    console.error("getUser error:", error);
    return res.status(error.status || 500).json(new ApiResponse(400, { user: null }, error.message || "Internal server error"));
  }
}