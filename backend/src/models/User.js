import mongoose from "mongoose";

import {
  compareOTP,
  comparePassword,
} from "../middleware/compareUserBcrypt.js";
import hashUserData from "../middleware/hashUserData.js";
import { passwordChanged } from "../middleware/passwordChangedAt.js";

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
    passwordChangedAt: { type: Date },
    role: { type: String, default: "tenant" },

    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", hashUserData);
userSchema.pre("save", passwordChanged);
userSchema.methods.comparePassword = comparePassword;
userSchema.methods.compareOTP = compareOTP;

const User = mongoose.model("User", userSchema);
export default User;
