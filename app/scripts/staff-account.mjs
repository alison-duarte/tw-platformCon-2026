// Prints one STAFF_ACCOUNTS entry. The password is read from stdin, never from
// argv, so it stays out of shell history and process lists.
import { DEFAULT_ITERATIONS, derivePasswordHash, randomSalt } from '../src/infrastructure/password-hash.js';

const [email, label] = process.argv.slice(2);
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Usage: npm run account:new -- <email> "<label>"');
if (!label || label.length > 40) fail('The label is required (up to 40 characters), e.g. "Equipe 1".');

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const password = Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
if (password.length < 12) fail('The password must have at least 12 characters. Nothing was printed.');

const salt = randomSalt();
const hash = await derivePasswordHash(password, salt, DEFAULT_ITERATIONS);
console.log(
  `  { label: ${JSON.stringify(label)}, email: ${JSON.stringify(email.trim().toLowerCase())}, ` +
    `salt: ${JSON.stringify(salt)}, iterations: ${DEFAULT_ITERATIONS}, hash: ${JSON.stringify(hash)} },`,
);
