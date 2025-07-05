import { Session } from "../models/session.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { setCookie } from "../utils/session.js";

export async function sessionMiddleware(req, res, next) {
  const sessionId = req.cookies?.session_id;
  if (!sessionId) {
    req.userId = undefined;
    return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
  }


  const session = await Session.findOne({ sessionId });

  if (!session || session.expiresAt < new Date()) {
    req.userId = undefined;
    return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
  }

  const expiresSoon = session.expiresAt.getTime() - Date.now() < 1000 * 60 * 60 * 12; // <12 hrs
  if (expiresSoon) {
    const newExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    session.expiresAt = newExpiry;
    Promise.resolve().then(() => {
      session.save();
    });
    setCookie(res, sessionId, newExpiry);
  }

  req.userId = session.userId;
  next();
}
