/**
 * Salted PBKDF2-SHA256 for the staff passwords, through the browser's WebCrypto.
 * Only the salt and the derived hash are ever stored, never the password.
 */
export const DEFAULT_ITERATIONS = 600000;

const encoder = new TextEncoder();

function toBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(text) {
  return Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
}

export function randomSalt() {
  return toBase64(crypto.getRandomValues(new Uint8Array(16)));
}

/** @returns {Promise<string>} base64 of the 256-bit derived key */
export async function derivePasswordHash(password, saltBase64, iterations) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64(saltBase64), iterations },
    key,
    256,
  );
  return toBase64(new Uint8Array(bits));
}

/** Constant-time comparison of two equal-format strings. */
function sameText(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i += 1) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

/** @returns {Promise<boolean>} true only when the password matches the stored account */
export async function verifyPassword(password, account) {
  if (!account.salt || !account.hash || !account.iterations) return false;
  const candidate = await derivePasswordHash(password, account.salt, account.iterations);
  return sameText(candidate, account.hash);
}
