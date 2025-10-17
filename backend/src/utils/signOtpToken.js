import crypto from "crypto";
import jwt from "jsonwebtoken";
//sign otp token - purpose can be 'verify_signup_email' or 'forgot_password' or others
export const signOtpToken = (user, purpose) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const payload = {
    id: user._id.toString(),
    email: user.email,
    otp: otp,
    purpose: purpose,
  };
  const expiresIn = "5m";
  const otpToken = jwt.sign(payload, process.env.JWT_OTP_SECRET, { expiresIn });

  return { otpToken, otp, expiresIn };
};

export const signResetPasswordToken = (user, purpose) => {
  const payload = {
    id: user._id.toString(),
    purpose: purpose,
  };
  const expiresIn = "10m";
  const resetPasswordToken = jwt.sign(
    payload,
    process.env.JWT_RESET_PASSWORD_SECRET,
    { expiresIn }
  );
  return { resetPasswordToken, expiresIn };
};
