---
name: aidlc-unit-build
description: Build one unit of the quiz spec (U1 to U3) through the AI-DLC construction loop - dependency and gate check, functional design, NFR check, code, tests and verify, then an audit entry. Use when the user asks to build, implement, start or continue a unit, a bolt (B1 to B3), or any item from .claude/aidlc-docs/inception/04-units-and-bolts.md.
---

# Build a unit (AI-DLC construction loop)

Work one unit at a time. Each unit must pass its own completion criteria in `.claude/aidlc-docs/inception/04-units-and-bolts.md` before the next starts.

## Step 0: gate check (stop here if it fails)

1. Read `.claude/aidlc-docs/README.md` and `inception/04-units-and-bolts.md`.
2. Check the unit's dependencies (U3, the publishing unit, needs U1 and U2 done).
3. Check the unit's blocking questions in `inception/06-open-questions.md`. Every one must have an answer, not "padrao" alone unless the user confirmed the default.
4. Publishing needs G4, the InfoSec gate. If it is open, stop and tell the user which part is blocked. Build only parts that handle no personal data, and only if the user agrees.

If any check fails, say which one, and stop. Do not write code to get around it.

## Step 1: functional design (written, not coded)

Write `.claude/aidlc-docs/construction/<unit-id>-design.md` (for example `u2-design.md`):
- Which requirement IDs (FR-xx, NFR-xx) and stories (US-xx) the unit covers.
- The files to create or change, by layer (`domain`, `application`, `infrastructure`, `features`, `composition`, `scripts/`).
- Interfaces: new or changed port methods in `application/ports.js`.
- Failure cases from `05-architecture.md`, mapped to the code path that handles each.
- Tests that will fail without the change (DoD 7.2).

Show the design to the user and wait for approval when the design changes a port, a data field or a rule. Otherwise continue.

## Step 2: NFR check

Check the design against `02-requirements.md` section 2: security (NFR-01 to NFR-05), privacy (NFR-06, NFR-07), resilience (NFR-08), budget (NFR-09), accessibility (NFR-11, NFR-12). Write the result into the design file as a short checklist.

## Step 3: code

- Follow `CLAUDE.md`: layers and import rules, kiosk CSS, brand tokens, bilingual strings in both `messages.pt.js` and `messages.en.js`.
- There is no network code. Passwords are checked only through `infrastructure/password-hash.js`, and accounts are generated only with `npm run account:new`.
- No new runtime dependency without a written reason in the design file, and an `npm audit` run.
- No `innerHTML`. No literal secrets. Test data uses placeholders.

## Step 4: tests and verify

1. Add the tests named in step 1 and confirm they fail before the change when practical.
2. Run from `app/`: `npm test`, then `npm run build`, then `npm run check:budget`, then `npm run verify`.
3. For U1 (access), also run the browser smoke test: login gate, wrong password, two runs without a new login, reload, sign out. Use a temporary account, then remove it from the source before finishing.
4. Report the exact results. If a check fails, show the output. Do not call the unit done.

## Step 5: close the unit

1. Walk the unit's "Critérios de pronto" in `04-units-and-bolts.md` and `DEFINITION_OF_DONE.md`. Mark each one as met, not met, or manual (needs a person).
2. Add an `.claude/aidlc-docs/audit.md` row with the unit, what was generated, and "Pendente" review.
3. Update `CLAUDE.md` "Status and known gaps" if the unit changes what is true about the app.
4. Recommend the review path: `code-reviewer` agent first, then a person (Q14).

Do not commit or open a pull request here. Use the `publish-github-pages` skill for that.

## Hard rules

- One unit per session when possible. Keep the diff small enough to review.
- Never weaken a test, a guardrail or a security rule to make the build pass. Report the failure instead.
- Never write real passwords or participant data into code, tests or docs. Staff emails appear only in `staff-accounts.js` when the user provides them.

> This code is AI-generated. It requires manual peer review and SAST/DAST scanning before deployment.
