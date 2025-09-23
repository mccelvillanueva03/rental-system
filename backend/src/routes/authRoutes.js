import express from 'express';
import { forgotPassword, getAllUsers, login, resendOTP, signup, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.get('/users', getAllUsers)
router.post('/login', login);
router.post('/signup', signup);
router.post('/verify-email-otp', verifyEmail);
router.post('/resend-email-otp', resendOTP);
router.post('/forgot-password', forgotPassword);

export default router;