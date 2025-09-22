import express from 'express';
import { getAllUsers, login, signup } from '../controllers/authController.js';

const router = express.Router();

router.get('/users', getAllUsers)
router.post('/login', login);
router.post('/signup', signup);

export default router;