import mongoose from "mongoose";
import { comparePassword } from "../middleware/comparePassword.js";
import hashUserData from "../middleware/hashUserData.js";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, default: "user" },
    
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", hashUserData)
userSchema.methods.comparePassword = comparePassword;

const User = mongoose.model("User", userSchema);
export default User;