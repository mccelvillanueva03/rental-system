import { OAuth2Client } from "google-auth-library";
import User from "../../models/User.js";
import { signToken } from "../../utils/signToken.js";

async function googleLogin(req, res) {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const { token } = req.body || {};

        if (!token)
            return res.status(400).json({ message: "Google Token is required." });

        //Verify the token with Google API
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        //extract user info from verified token
        const { email, given_name, family_name, sub } = ticket.getPayload();

        const first = (given_name || "").trim();
        const last = (family_name || "").trim();
        const fullName = [first, last].filter(Boolean).join(" ");

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = sub;
                user.isGoogleAccount = true;
                await user.save();
            }
        } else {
            user = new User({
                email,
                fullName: fullName,
                googleId: sub,
                isGoogleAccount: true,
                isEmailVerified: true,
                //generate a random password they wont use
                //required field in schema but wont be used in login.
                password: Math.random().toString(36).slice(-8), //generate a random password
            });
            await user.save();
        }
        const jwtToken = signToken(user);
        const userSafe = user.toObject();
        delete userSafe.password;

        return res.status(200).json({ token: jwtToken, user: userSafe });
    } catch (error) {
        console.log("Error in Google Login.", error);
        res.status(500).json({ message: "Server Error." });
    }
}

export default googleLogin;