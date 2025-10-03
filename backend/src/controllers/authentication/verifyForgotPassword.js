import User from "../../models/User.js";
import { signToken } from "../../utils/signToken.js";

async function verifyForgotPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body || {};
        if (!email || !otp || !newPassword)
            return res.status(400).json({ message: "All fields required." });

        const user = await User.findOne({ email }).select("+password");
        //check if email exist
        if (!user) return res.status(404).json({ message: "Email Not Found." });

        const isOtpMatch = await user.compareOTP(otp);
        //check if otp is matched
        if (!isOtpMatch) return res.status(401).json({ message: "Invalid OTP." });
        //check otp if expired
        if (user.otpExpiresAt <= Date.now())
            return res
                .status(410)
                .json({ message: "OTP expired. Please request again." });

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = signToken(user);
        const userSafe = user.toObject();
        delete userSafe.password;

        return res.status(200).json({ token, user: userSafe });
    } catch (error) {
        console.log("Error in verifying Forgot Password.", error);
        return res.status(500).json({ message: "Server Error." });
    }
}

export default verifyForgotPassword;