import User from "../../models/User.js";
import { signToken } from "../../utils/signAccessToken.js";
import { cookieOptions } from "./refreshToken.js";

async function resetPassword(req, res) {
  try {
    const { newPassword } = req.body || {};
    if (!newPassword)
      return res.status(400).json({ message: "All fields required." });

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json("User not Found");

    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      signToken(user);

    user.password = newPassword;
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = refreshTokenExpiresAt;
    await user.save();

    const userSafe = user.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;
    delete userSafe.refreshTokenExpiresAt;

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({ accessToken, user: userSafe });
  } catch (error) {
    console.log("Error in Reset Password", err);
    return res.status(500).json({ message: "Server Error" });
  }
}
export default resetPassword;
