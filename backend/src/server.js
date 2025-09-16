import express from 'express';
import dotenv from 'dotenv';

import userRouter from "./routes/authRoutes.js";
import { connectDB } from './config/db.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use("/api/users", userRouter);

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server is started on PORT:', PORT);
  });
});