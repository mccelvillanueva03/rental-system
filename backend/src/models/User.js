import mongoose from "mongoose";
import { hashPassword } from "../middleware/hashPassword.js";
import { comparePassword } from "../middleware/comparePassword.js";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
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
  },
  { timestamps: true }
);

userSchema.pre("save", hashPassword);
userSchema.methods.comparePassword = comparePassword;

const User = mongoose.model("User", userSchema);
export default User;