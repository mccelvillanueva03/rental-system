import { ipRateLimiter, userRateLimiter } from "../controllers/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Limit by IP address
    const ipLimit = await ipRateLimiter.limit(req.ip);
    if (!ipLimit.success) {
      return res
        .status(429)
        .json({ message: "Too many requests from this IP." });
    }

    // If user is authenticated, limit by user ID
    if (req.user) {
      // Assuming req.user is set by your authentication middleware
      const userLimit = await userRateLimiter.limit(req.user.id); // Use user ID for limiting
      if (!userLimit.success) {
        return res
          .status(429)
          .json({ message: "Too many requests from this user." });
      }
    }
    next();
  } catch (error) {
    console.log("Error in Rate Limiter", error);
    res.status(500).json({ message: "Server Error." });
  }
};

export default rateLimiter;
