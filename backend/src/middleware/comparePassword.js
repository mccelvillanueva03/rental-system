import bcrypt from "bcryptjs";

export function comparePassword(password) {
    return bcrypt.compare(password, this.password);
}