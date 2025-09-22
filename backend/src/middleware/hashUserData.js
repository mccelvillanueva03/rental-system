import bcrypt from "bcryptjs";

async function hashUserData(next) {
    if (this.isModified("password")) {
        const saltPassword = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltPassword);
    }
    if (this.isModified("otp")) {
        const saltOtp = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, saltOtp);
    }
    next();
}
export default hashUserData;