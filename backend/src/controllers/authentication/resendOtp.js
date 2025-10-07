import User from "../../models/User.js";
import { sendEmailOTP } from "../../utils/sendEmailOTP.js";

async function resendOTP(req, res) {
  try {
    const { email } = req.body || {};
    if (!email)
      return res.status(400).json({ message: "All fields are required!." });

    const user = await User.findOne({ email });
    //check if user exist
    if (!user)
      return res.status(404).json({
        message: "Email Not Found!.",
      });
    //check if user is already verified
    if (user.isEmailVerified)
      return res
        .status(401)
        .json({ message: "Already verified. Proceed to login." });

    //resend email
    const result = sendEmailOTP(user);
    return res
      .status(200)
      .json({ message: "OTP send successfully", ...result });
  } catch (error) {
    console.log("Error in Resending OTP", error);
    res.status(500).json({ message: "Server Error." });
  }
}
export default resendOTP;
