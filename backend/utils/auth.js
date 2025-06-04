import { randomBytes, scrypt, timingSafeEqual } from "crypto";


export function hashPassword(password, salt) {

  return new Promise((resolve, reject) => {
    scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) {
        reject(error);
      }

      resolve(hash.toString("hex").normalize());
    });
  });
}

export function generateRandomSalt(bytes) {
  return randomBytes(bytes || 16)
    .toString("hex")
    .normalize();
}

export async function verifyPassword(
  hashedPassword,
  password,
  salt,
) {

  const inputHashedPassword = await hashPassword(password, salt);
  return timingSafeEqual(Buffer.from(inputHashedPassword, "hex"), Buffer.from(hashedPassword, "hex"));
}