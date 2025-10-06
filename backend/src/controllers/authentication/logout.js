import User from "../../models/User.js";

async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Cookies sent:", req.cookies);
    
    if (!refreshToken) {
      return res.status(200).json({ message: "No active Session." });
    }
    const user = await User.findOne({ refreshToken }).select("+refreshToken");
    if (!user) {
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(200).json({ message: "Logged out successfully." });
    }
    user.refreshToken = undefined;
    user.refreshTokenExpiresAt = undefined;
    await user.save();
    //clear cookie from client side
    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // false in dev
        sameSite: "lax",
        path: "/",
      })
      .status(200)
      .json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Server error." });
  }
}
export default logout;
