import User from "../../models/User.js";
import { addToBlacklist } from "../../utils/blacklistToken.js";
import { signAccessToken } from "../../utils/signTokens.js";
import { cookieOptions } from "../authentication/refreshToken.js";

async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body || {};
    const id = req.user.id;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "All fields are required!." });

    const user = await User.findById(id).select("+password");
    //check if user existing
    if (!user) return res.status(404).json({ message: "User Not Found." });
    //check if email is verified
    if (!user.isEmailVerified)
      return res.status(401).json({ message: "Email is not verified!" });
    //check if oldPassword match to stored password

    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    if (oldPassword === newPassword)
      return res.status(400).json({ message: "Password still the same" });

    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      signAccessToken(user);
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = refreshTokenExpiresAt;
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    const userSafe = user.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;
    delete userSafe.refreshTokenExpiresAt;

    await addToBlacklist(req.cpPayload.jti, 600);

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .status(200)
      .json({ user: userSafe });
  } catch (error) {
    console.log("Error in Changing Password.", error);
    res.status(500).json({ message: "Server Error." });
  }
}
export default changePassword;
