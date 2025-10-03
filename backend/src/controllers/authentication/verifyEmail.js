import { del } from "flat-cache/src/del.js";
import User from "../../models/User.js";
import { signToken } from "../../utils/signToken.js";
import { cookieOptions } from "./refreshToken.js";

async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required!." });
    }
    const pendingUser = await User.findOne({ email });

    //checks if email exist
    if (!pendingUser)
      return res.status(404).json({
        message: "Email Not Found!.",
      });

    //check if the user email is already verified
    if (pendingUser.isEmailVerified)
      return res
        .status(409)
        .json({ message: "Email is already verified. Proceed to login." });
    //compare otp to hashed otp
    const isOTPMatch = await pendingUser.compareOTP(otp);
    //check if otp matched
    if (!isOTPMatch) return res.status(401).json({ message: "Invalid OTP." });

    //check if otp is expired
    if (pendingUser.otpExpiresAt <= Date.now()) {
      pendingUser.otp = undefined;
      pendingUser.otpExpiresAt = undefined;
      await pendingUser.save();
      return res
        .status(410)
        .json({ message: "OTP expired. Please request again." });
    }
    //otp matched, otp !expired
    const { accessToken, refreshToken, refreshTokenExpiresAt } = signToken(pendingUser);

    pendingUser.refreshToken = refreshToken;
    pendingUser.refreshTokenExpiresAt = refreshTokenExpiresAt;
    pendingUser.isEmailVerified = true;
    pendingUser.otp = undefined;
    pendingUser.otpExpiresAt = undefined;

    await pendingUser.save();

    const userSafe = pendingUser.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;
    delete userSafe.refreshTokenExpiresAt;

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({ accessToken, user: userSafe });
  } catch (error) {
    console.log("Error in verifying email", error);
    res.status(500).json({ message: "Server Error." });
  }
}

export default verifyEmail;
