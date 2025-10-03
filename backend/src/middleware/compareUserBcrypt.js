import bcrypt from "bcryptjs";

export function comparePassword(password) {
    return bcrypt.compare(password, this.password);
}

export function compareOTP(otp) {
    if (!this.otp) return false;
    return bcrypt.compare(otp, this.otp);
}
