import express from 'express';
import dotenv from 'dotenv';

import authRouter from "./routes/authRoutes.js";
import { connectDB } from './config/db.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use("/api/auth", authRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is started on PORT:', PORT);
  });
});