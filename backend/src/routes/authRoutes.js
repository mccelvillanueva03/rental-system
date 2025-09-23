import express from 'express';
import { getAllUsers, login, signup, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.get('/users', getAllUsers)
router.post('/login', login);
router.post('/signup', signup);
router.post('/verify-email-otp', verifyEmail);

export default router;