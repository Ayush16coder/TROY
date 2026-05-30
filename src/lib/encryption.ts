import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

// The encryption key should be 32 bytes long. If it's not, we derive a 32-byte key from it using PBKDF2.
function getKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY || "default_development_encryption_key_32_bytes";
  if (envKey.length === 32) {
    return Buffer.from(envKey, "utf-8");
  }
  // If not exactly 32 bytes, derive a safe key
  return crypto.pbkdf2Sync(envKey, "nexusforge-salt", 100000, KEY_LENGTH, "sha512");
}

/**
 * Encrypts a string using AES-256-GCM.
 * The output format is: iv:salt:tag:encrypted_data (hex encoded)
 */
export function encryptToken(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  // Use a unique key per encryption by deriving from the master key + random salt
  const key = crypto.pbkdf2Sync(getKey(), salt, 100000, KEY_LENGTH, "sha512");
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return `${iv.toString("hex")}:${salt.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts a string that was encrypted with encryptToken().
 */
export function decryptToken(encryptedText: string): string {
  if (!encryptedText) return encryptedText;
  
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 4) return encryptedText; // Not in our encrypted format
    
    const iv = Buffer.from(parts[0], "hex");
    const salt = Buffer.from(parts[1], "hex");
    const tag = Buffer.from(parts[2], "hex");
    const encrypted = Buffer.from(parts[3], "hex");
    
    const key = crypto.pbkdf2Sync(getKey(), salt, 100000, KEY_LENGTH, "sha512");
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt token");
  }
}
