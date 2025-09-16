import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ token, user: userSafe });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function signup(req, res) {
  try {
    let { email, password, fullName } = req.body || {};
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required!." });
    }

    email = String(email).trim().toLowerCase();
    fullName = String(fullName).trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    const newUser = new User({ email, password, fullName });
    await newUser.save();

    const token = signToken(newUser);
    const userSafe = newUser.toObject();
    delete userSafe.password;

    return res.status(201).json({ token, user: userSafe });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email is already in use." });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}