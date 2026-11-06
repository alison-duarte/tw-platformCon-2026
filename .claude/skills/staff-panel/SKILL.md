---
name: staff-panel
description: Build and change the team access on the quiz - the login gate (first screen, two fixed accounts stored as PBKDF2 hashes), the 5-failures lockout, the session that survives reloads and lasts until sign-out, the staff panel with the participant list, the CSV export built from localStorage, and the two-step delete-all. Use when the user asks about login, passwords, accounts, the gate, sign-out, the staff panel, the CSV download, or delete-all.
---

# Team access and staff panel

Requirements: FR-01 to FR-14 and US-01 to US-03, US-04 to US-06 in `.claude/aidlc-docs/inception/`. Read `02-requirements.md` and `05-architecture.md` first.

## The model in one paragraph

The site is public. The first screen is a login. A valid team account unlocks the quiz, and the unlock is kept in `localStorage` until someone taps "Sair" in the staff panel. Participants never see the login again between runs. Passwords never exist in code: each account is a salt and a PBKDF2 hash.

## Hard rules

1. **No password in the repo.** Never write, log or paste a password into code, tests, docs, chat or the commit. Generate accounts only with `npm run account:new`, with the password on stdin.
2. **Fail closed.** With no accounts configured, nobody gets in. A missing salt or hash never verifies.
3. **Generic errors.** A wrong email and a wrong password get the same message. Never say which one.
4. **Keep the gate on every entry path.** The quiz, the registration and the staff panel are reached only through `app.isUnlocked()`. Do not add a bypass, a debug flag or a query parameter that skips the gate.
5. **No inactivity timeout.** Decision Q8: the session ends only with "Sair". Do not add an idle timer without a new decision.
6. **Be honest about the limit.** This gate stops casual use on a public page. Anyone who reads the code or writes `localStorage` can get past it. Say so whenever the gate is discussed as security. Real protection needs a server, which is out of scope.
7. **No network.** Do not add a remote login, an external script or a font.

## Files

- `app/src/domain/access-lock.js`: lockout rules (5 failures, 30 seconds) and email matching.
- `app/src/application/create-access-control.js`: login, lock, unlock check.
- `app/src/infrastructure/password-hash.js`: PBKDF2-SHA256 (600,000 iterations, 16-byte salt) and a constant-time comparison.
- `app/src/infrastructure/local-access-store.js`: session and lockout keys in `localStorage`.
- `app/src/content/staff-accounts.js`: the account list. Entries only, never passwords.
- `app/scripts/staff-account.mjs`: prints one entry. Password from stdin, 12 characters minimum.
- `app/src/features/login/`: the login screen.
- `app/src/features/staff/`: the panel, with list, CSV, delete-all and "Sair".

## Procedure: add or change an account

1. Ask the user for the email and the label (for example "Equipe 1"). Do not invent either.
2. Tell the user to set the password in their own terminal, never in the chat:
   `read -s PW && printf '%s' "$PW" | npm run account:new -- <email> "<label>"`
3. Paste the printed line into `staff-accounts.js`. Run `npm test` and check that `staff-accounts.test.js` passes.
4. Never ask for the password or store it. If the user pastes one, flag it as exposed and ask them to change it.

## Procedure: change the gate

1. Write the test first: `access.test.js` for rules, `quiz-app.test.js` for the flow.
2. Keep the messages in both `messages.pt.js` and `messages.en.js`. The login messages use placeholders (`{seconds}`), so never write a number into the copy.
3. Run `npm run verify`. Then the browser check: wrong password, correct password, two runs without a login, reload, "Sair", reload again.

## Procedure: CSV and delete-all

- The CSV is built from `localStorage` through `repository.list()` and `csv.js`. The columns, order, BOM and CRLF do not change without telling the raffle owner.
- Delete-all needs a second tap. The confirmation text tells the user to export first (Q6).

## Verification

From `app/`: `npm run verify`. Then the browser smoke test (see `app/README.md`). Real iPad checks are still open in `DEFINITION_OF_DONE.md` 5.5.

> This code is AI-generated. It requires manual peer review and SAST/DAST scanning before deployment.
