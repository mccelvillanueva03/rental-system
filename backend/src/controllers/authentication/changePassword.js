import User from "../../models/User.js";
import { signToken } from "../../utils/signToken.js";

async function changePassword(req, res) {
    try {
        const { email, oldPassword, newPassword } = req.body || {};
        if (!email || !oldPassword || !newPassword)
            return res.status(400).json({ message: "All fields are required!." });

        const user = await User.findOne({ email }).select("+password");
        //check if user existing
        if (!user) return res.status(404).json({ message: "Email Not Found." });
        //check if email is verified
        if (!user.isEmailVerified)
            return res.status(401).json({ message: "Email is not verified!" });
        //check if oldPassword match to stored password

        const isPasswordMatch = await user.comparePassword(oldPassword);
        if (!isPasswordMatch)
            return res.status(401).json({ message: "Invalid Credentials" });

        if (oldPassword === newPassword)
            return res.status(400).json({ message: "Password still the same" });

        user.password = newPassword;
        user.passwordChangedAt = Date.now();
        await user.save();

        const token = signToken(user);
        const userSafe = user.toObject();
        delete userSafe.password;

        return res.status(200).json({ token, user: userSafe });
    } catch (error) {
        console.log("Error in Changing Password.", error);
        res.status(500).json({ message: "Server Error." });
    }
}
export default changePassword;