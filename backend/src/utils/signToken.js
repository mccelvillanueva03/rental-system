import jwt from "jsonwebtoken";
import crypto from "crypto";

export const signToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "30m",
  });
  // Generate a secure random refresh token
  const refreshToken = crypto.randomBytes(64).toString("hex");
  // Set refresh token expiration time (e.g., 7 days from now)
  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  // Note: Make sure to save the user document after calling signToken to persist the refreshToken and its expiration.

  return { accessToken, refreshToken, refreshTokenExpiresAt };
};
