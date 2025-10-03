import bcrypt from "bcryptjs";

export function comparePassword(password) {
    return bcrypt.compare(password, this.password);
}

export function compareOTP(otp) {
    if (!this.otp) return false;
    return bcrypt.compare(otp, this.otp);
}

export function compareRefreshToken(refreshToken) {
    if (!this.refreshToken) return false;
    return bcrypt.compare(refreshToken, this.refreshToken);
}
