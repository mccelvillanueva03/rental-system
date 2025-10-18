import { signChangePasswordToken } from "../../utils/signTokens.js";
import User from "../../models/User.js";
import { addToBlacklist } from "../../utils/blacklistToken.js";
import { cookieOptions } from "../authentication/refreshToken.js";

async function verifyChangePassword(req, res) {
  try {
    const { otp } = req.body || {};
    const { otp: otpFromToken, id } = req.otpPayload;
    if (!otp) {
      return res.status(400).json({ message: "All fields are required!." });
    }
    const user = await User.findById(req.user.id);
    //check if user exist
    if (!user) return res.status(404).json({ message: "User Not Found." });
    //check if the user email is already verified
    if (!user.isEmailVerified)
      return res.status(401).json({ message: "Email is not verified!" });
    //check if otp matched
    if (otp !== otpFromToken)
      return res.status(410).json({ message: "Invalid OTP." });

    if (Date.now() / 1000 > req.otpPayload.exp) {
      return res.status(400).json({ message: "OTP expired." });
    }
    const { changePasswordToken, expiresIn } = signChangePasswordToken(user);

    await addToBlacklist(req.otpPayload.jti, 300);

    req.userId = id;
    return res
      .cookie("changePasswordToken", changePasswordToken, cookieOptions)
      .status(200)
      .json({
        message: "Proceed to change password.",
      });
  } catch (error) {
    console.log("Error in verifying Change Password.", error);
    return res.status(500).json({ message: "Server Error." });
  }
}

export default verifyChangePassword;
