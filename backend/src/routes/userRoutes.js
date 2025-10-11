import express from 'express';
import viewProfile from '../controllers/users/viewProfile.js';

const router = express.Router();

router.get('/:id', viewProfile);

export default router;