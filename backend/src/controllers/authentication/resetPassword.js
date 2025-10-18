import User from "../../models/User.js";
import { addToBlacklist } from "../../utils/blacklistToken.js";
import { signAccessToken } from "../../utils/signTokens.js";
import { cookieOptions } from "./refreshToken.js";

async function resetPassword(req, res) {
  try {
    const { newPassword } = req.body || {};
    if (!newPassword)
      return res.status(400).json({ message: "All fields required." });

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json("User not Found");

    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      signAccessToken(user);

    user.password = newPassword;
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = refreshTokenExpiresAt;
    await user.save();

    const userSafe = user.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;
    delete userSafe.refreshTokenExpiresAt;

    await addToBlacklist(req.resetPayload.jti, 600);
    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .status(200)
      .json({ user: userSafe });
  } catch (error) {
    console.log("Error in Reset Password", err);
    return res.status(500).json({ message: "Server Error" });
  }
}
export default resetPassword;
