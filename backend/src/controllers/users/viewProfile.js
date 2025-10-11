import User from "../../models/User.js";

async function viewProfile(req, res) {
  try {
    const user = await User.findOne(req.params.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userSafe = user.toObject();
    delete userSafe.isGoogleAccount;
    delete userSafe.googleId;
    delete userSafe.createdAt;
    delete userSafe.updatedAt;
    delete userSafe.passwordChangedAt;
    delete userSafe.otp;
    delete userSafe.otpExpiresAt;
    delete userSafe.isEmailVerified;

    return res.status(200).json({ user: userSafe });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export default viewProfile;
