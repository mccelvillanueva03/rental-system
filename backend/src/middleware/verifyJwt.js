import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function verifyToken(req, res, next) {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer "))
      return res.status(400).json({ message: "Not Authorized." });

    const token = authHeaders.split(" ")[1];

    //Verify with ACCESS secret
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User Not Found." });

    //check if user changed password after token was issued
    if (user.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      if (passwordChangedTimestamp > decoded.iat)
        return res.status(401).json({
          message: "Password was changed. Please log in again.",
        });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    console.log("Error in verifying token:", error);
    return res.status(500).json({ message: "Server Error." });
  }
}

export function authorizeRole(...roles) {
  return (req, res, next) => {
    // Ensure req.user is set by verifyToken middleware
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied." });
    }
    // If the role is authorized, proceed to the next middleware
    next();
  };
}
