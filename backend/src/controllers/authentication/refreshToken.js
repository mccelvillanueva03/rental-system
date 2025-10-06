import User from "../../models/User.js";
import { signToken } from "../../utils/signToken.js";

// Cookie options
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function refreshToken(req, res) {
  try {
    // Read refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided." });
    }
    // Find user by refresh token
    const user = await User.findOne({ refreshToken }).select("+refreshToken");
    if (!user) return res.status(404).json({ message: "User Not Found." });

    //compare refreshToken to user db refreshToken
    if (!user.refreshToken || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    user.select("+refreshTokenExpiresAt");
    // Check if refresh token is expired
    if (user.refreshTokenExpiresAt <= Date.now()) {
      user.refreshToken = null;
      user.refreshTokenExpiresAt = null;
      await user.save();
      return res
        .status(403)
        .json({ message: "Refresh Token expired. Please login again." });
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt,
    } = signToken(user);
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiresAt = refreshTokenExpiresAt;
    await user.save();
    const userSafe = user.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;

    return res
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .status(200)
      .json({ accessToken, user: userSafe });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    return res.status(500).json({ message: "Server error." });
  }
}
