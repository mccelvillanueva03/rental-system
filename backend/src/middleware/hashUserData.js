import bcrypt from "bcryptjs";

async function hashUserData(next) {
  //if password is modified, hash it before saving
  if (this.isModified("password")) {
    const saltPassword = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltPassword);
  }
  next();
}
export default hashUserData;
