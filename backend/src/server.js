import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server is started on PORT:', PORT);
  });
});