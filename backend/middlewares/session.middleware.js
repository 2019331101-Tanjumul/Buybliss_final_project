import { Session } from "../models/session.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { setCookie } from "../utils/session.js";

export async function sessionMiddleware(req, res, next) {
  const sessionId = req.cookies?.session_id;
  if (!sessionId) return new ApiResponse(403, {}, "Forbidden");


  const session = await Session.findOne({ sessionId });

  if (!session || session.expiresAt < new Date()) return new ApiResponse(403, {}, "Forbidden");

  const newExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  session.expiresAt = newExpiry;
  await session.save();

  setCookie(res, sessionId, newExpiry);

  req.userId = session.userId;
  next();
}
