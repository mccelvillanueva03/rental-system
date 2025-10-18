import User from "../../models/User.js";
import { signAccessToken } from "../../utils/signTokens.js";
import { cookieOptions } from "./refreshToken.js";

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    //check if user existing
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    //checks if user is verified
    if (!user.isEmailVerified)
      return res.status(401).json({ message: "Email is not verified." });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      signAccessToken(user);
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = refreshTokenExpiresAt;
    await user.save();

    const userSafe = user.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;
    delete userSafe.refreshTokenExpiresAt;

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .status(200)
      .json({ user: userSafe });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}
export default login;
