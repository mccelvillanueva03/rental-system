export function capitalizedFirstLetter(str) {
  if (str === null || str.length === 0) {
    return str;
  }
  const capitalLetter = str.charAt(0).toUpperCase();
  return capitalLetter + str.slice(1);
}
