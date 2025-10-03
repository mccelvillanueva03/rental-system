import { OAuth2Client } from "google-auth-library";
import User from "../../models/User.js";
import { signToken } from "../../utils/signToken.js";
import { cookieOptions } from "./refreshToken.js";

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

    let user = await User.findOne({ email });
    const { accessToken, refreshToken, refreshTokenExpiresAt } = signToken(user);

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        user.isGoogleAccount = true;
        await user.save();
      }
    } else {
      user = new User({
        refreshToken,
        refreshTokenExpiresAt,
        email,
        firstName: (given_name || "").trim(),
        lastName: (family_name || "").trim(),
        googleId: sub,
        isGoogleAccount: true,
        isEmailVerified: true,
        password: Math.random().toString(36).slice(-8), //generate a random password
      });
      await user.save();
    }
    const userSafe = user.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;
    delete userSafe.refreshTokenExpiresAt

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({ accessToken, user: userSafe });
  } catch (error) {
    console.log("Error in Google Login.", error);
    res.status(500).json({ message: "Server Error." });
  }
}

export default googleLogin;
