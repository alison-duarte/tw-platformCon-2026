import assert from 'node:assert/strict';
import { test } from 'node:test';
import { STAFF_ACCOUNTS } from '../src/content/staff-accounts.js';

test('every configured account has a label, an email, a salt, iterations and a hash, and no password field', () => {
  for (const account of STAFF_ACCOUNTS) {
    assert.deepEqual(Object.keys(account).sort(), ['email', 'hash', 'iterations', 'label', 'salt']);
    for (const key of ['label', 'email', 'salt', 'hash']) assert.equal(typeof account[key], 'string', key);
    assert.ok(Number.isInteger(account.iterations) && account.iterations >= 100000, 'iterations');
  }
});
