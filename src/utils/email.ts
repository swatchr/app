export function partialMaskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex < 1) {
    // Not a valid email, return the original string
    return email;
  }
  const username = email.slice(0, atIndex);
  const maskedUsername = `${username.slice(0, 3)}${'*'.repeat(
    username.length - 3
  )}`;
  const domain = email.slice(atIndex);
  return `${maskedUsername}${domain}`;
}
