import User from "../../models/User.js";
import { sendEmailOTP } from "../../utils/sendEmailOTP.js";
import { signOtpToken } from "../../utils/signTokens.js";
import { cookieOptions } from "../authentication/refreshToken.js";

async function reqChangePassword(req, res) {
  try {
    const id = req.user.id;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User Not Found." });

    if (!user.isEmailVerified)
      return res.status(401).json({ message: "Email is not verified!" });

    const purpose = "request_change_password";
    const { otpToken, otp, expiresIn } = signOtpToken(user, purpose);

    sendEmailOTP(user, otp);

    req.userId = id;
    return res
      .cookie("otpToken", otpToken, cookieOptions)
      .status(200)
      .json({ message: "OTP sent to email.", expiresIn });
  } catch (error) {
    console.log("Error in requesting Change Password", error);
    res.status(500).json({ message: "Server Error." });
  }
}

export default reqChangePassword;
