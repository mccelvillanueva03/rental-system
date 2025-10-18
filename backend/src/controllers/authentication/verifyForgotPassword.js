import User from "../../models/User.js";
import { signResetPasswordToken } from "../../utils/signTokens.js";
import { addToBlacklist } from "../../utils/blacklistToken.js";
import { cookieOptions } from "./refreshToken.js";

async function verifyForgotPassword(req, res) {
  try {
    const { otp } = req.body || {};
    const { otp: otpFromToken, id } = req.otpPayload;
    if (!otp) return res.status(400).json({ message: "All fields required." });

    const user = await User.findById(req.user.id);
    //check if email exist
    if (!user) return res.status(404).json({ message: "User Not Found." });

    //check if otp is matched
    if (otp !== otpFromToken)
      return res.status(410).json({ message: "Invalid Code" });

    const { token, expiresIn } = signResetPasswordToken(user);

    await addToBlacklist(req.otpPayload.jti, 300);
    req.userId = id;
    return res
      .cookie("resetPasswordToken", token, cookieOptions)
      .status(200)
      .json({ expiresIn });
  } catch (error) {
    console.log("Error in verifying Forgot Password.", error);
    return res.status(500).json({ message: "Server Error." });
  }
}

export default verifyForgotPassword;
