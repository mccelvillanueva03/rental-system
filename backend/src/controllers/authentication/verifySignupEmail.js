import { addToBlacklist } from "../../utils/blacklistToken.js";
import { signAccessToken } from "../../utils/signTokens.js";
import { cookieOptions } from "./refreshToken.js";

async function verifyEmail(req, res) {
  try {
    const { otp } = req.body || {};
    if (!otp) {
      return res.status(400).json({ message: "All fields are required!." });
    }
    const pendingUser = req.user;
    //check if the user email is already verified
    if (pendingUser.isEmailVerified)
      return res
        .status(409)
        .json({ message: "Email is already verified. Proceed to login." });

    //check if otp matched
    if (otp !== req.otpPayload.otp)
      return res.status(401).json({ message: "Invalid OTP." });

    if (Date.now() / 1000 > req.otpPayload.exp) {
      return res.status(400).json({ message: "OTP expired." });
    }

    //otp matched
    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      signAccessToken(pendingUser);

    pendingUser.refreshToken = refreshToken;
    pendingUser.refreshTokenExpiresAt = refreshTokenExpiresAt;
    pendingUser.isEmailVerified = true;

    await pendingUser.save();

    const userSafe = pendingUser.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;
    delete userSafe.refreshTokenExpiresAt;

    await addToBlacklist(req.otpPayload.jti, 600);
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
