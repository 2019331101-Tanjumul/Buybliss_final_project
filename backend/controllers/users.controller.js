import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



export async function getCurrentUser(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
    }

    const user = await User.findById(userId).select("-hashedPassword -salt");
    if (!user) {
      return res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
    }
    return res.status(200).json(new ApiResponse(200, user, "Fetched user successfully"));
  } catch (error) {
    console.error("getUser error:", error);
    return res.status(error.status || 500).json(new ApiResponse(400, {}, error.message || "Internal server error"));
  }
}