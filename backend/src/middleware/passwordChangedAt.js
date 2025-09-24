export function passwordChanged(next) {
  if (this.isModified("password")) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
}
