import bcrypt from "bcryptjs";

async function hashUserData(next) {
  //if user is using google account, skip hashing
  if (this.isGoogleAccount) return next();

  //if password is modified, hash it before saving
  if (this.isModified("password")) {
    const saltPassword = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltPassword);
  }
  //if otp is modified, hash it before saving
  if (this.isModified("otp") && this.otp) {
    const saltOtp = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, saltOtp);
  }

  next();
}
export default hashUserData;
