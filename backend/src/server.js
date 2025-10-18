import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 5001;

// Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173", //frontend URL
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is started on PORT:", PORT);
  });
});
