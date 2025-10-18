import User from "../../models/User.js";

const cookieClearOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // false in dev
  sameSite: "lax",
  path: "/",
};

async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .clearCookie("refreshToken", cookieClearOptions)
        .status(200)
        .json({ message: "No active session to log out from." });
    }

    const user = await User.findOne({ refreshToken }).select(
      "+refreshToken +refreshTokenExpiresAt"
    );
    if (!user) {
      res.clearCookie("refreshToken", cookieClearOptions);
      return res.status(200).json({ message: "Logged out successfully." });
    }
    user.refreshToken = undefined;
    user.refreshTokenExpiresAt = undefined;
    await user.save();
    //clear cookie from client side
    return res
      .clearCookie("refreshToken", cookieClearOptions)
      .clearCookie("accessToken", cookieClearOptions)
      .clearCookie("otpToken", cookieClearOptions)
      .clearCookie("resetToken", cookieClearOptions)
      .clearCookie("cpToken", cookieClearOptions)
      .clearCookie("changePasswordToken", cookieClearOptions)
      .status(200)
      .json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Server error." });
  }
}
export default logout;
