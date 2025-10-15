import crypto from "crypto";
import jwt from "jsonwebtoken";

export const signOtpToken = (user, purpose) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const payload = {
    id: user._id.toString(),
    email: user.email,
    otp: otp,
    purpose: purpose,
  };

  const otpToken = jwt.sign(payload, process.env.JWT_OTP_SECRET, {
    expiresIn: "5m",
  });

  return { otpToken, otp };
};
