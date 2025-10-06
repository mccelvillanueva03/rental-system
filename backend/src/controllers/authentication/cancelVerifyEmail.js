import User from "../../models/User.js";

async function cancelVerifyEmail(req, res) {
  try {
    const { email } = req.body || {};
    const pendingUser = await User.findOne({ email, isEmailVerified: false });

    if (!pendingUser) {
      return res
        .status(404)
        .json({ message: "Email not found or already verified." });
    }

    await pendingUser.deleteOne();

    return res.status(200).json({ message: "Email verification canceled." });
  } catch (error) {
    console.log("Error in canceling email verification", error);
    await pendingUser.deleteOne();
    res.status(500).json({ message: "Server Error." });
  }
}

export default cancelVerifyEmail;
