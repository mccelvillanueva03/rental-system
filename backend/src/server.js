import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
if (!process.env.NODE_ENV === "production") {
  app.use(cors({
    origin: 'http://localhost:5173', //frontend URL
  }))
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/auth", authRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is started on PORT:", PORT);
  });
});
