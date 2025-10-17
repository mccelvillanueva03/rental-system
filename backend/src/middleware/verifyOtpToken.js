import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function verifyOtpToken(req, res, next) {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer "))
      return res.status(401).json({ message: "Not Authorized" });

    const otpToken = authHeaders.split(" ")[1];
    const otpPayload = jwt.verify(otpToken, process.env.JWT_OTP_SECRET);

    const user = await User.findById(otpPayload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    req.otpPayload = otpPayload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "OTP Token expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid OTP Token." });
    }
    console.log("Error in verifying OTP Token:", error);
    return res.status(500).json({ message: "Server Error." });
  }
}

export async function verifyResetPasswordToken(req, res, next) {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer "))
      return res.status(401).json({ message: "Not Authorized" });

    const resetToken = authHeaders.split(" ")[1];
    const resetPayload = jwt.verify(
      resetToken,
      process.env.JWT_RESET_PASSWORD_SECRET
    );

    const user = await User.findById(resetPayload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    req.resetPayload = resetPayload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "OTP Token expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid OTP Token." });
    }
    console.log("Error in verifying OTP Token:", error);
    return res.status(500).json({ message: "Server Error." });
  }
}

export function otpPurpose(purpose) {
  return (req, res, next) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "User not Authenticated." });

      const reqPurpose = req.otpPayload?.purpose ?? req.resetPayload?.purpose;

      if (reqPurpose !== purpose)
        return res.status(403).json({ message: "Access Denied" });

      next();
    } catch (error) {
      console.log("Error in purpose checking", error);
      return res.status(500).json({ message: "Server Error." });
    }
  };
}
