import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';

dotenv.config()

export const sendOTP = async () =>{
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);

    } catch (error) {
        console.log("Error in sending email OTP.", error)
    }
} 