import { generateRandomSalt } from "./auth.js";
import { Session } from "../models/session.model.js";

export async function createSession(userId, res) {
  const sessionId = generateRandomSalt(64);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  const session = await Session.create({ sessionId: sessionId, userId: userId, expiresAt: expiresAt });
  if (!session) return false;
  setCookie(res, sessionId, expiresAt);
  return true;
}

export function setCookie(res, sessionId, expiresAt) {
  res.cookie("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
  });
}