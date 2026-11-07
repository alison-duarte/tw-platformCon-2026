# Project context

Booth quiz for Thoughtworks at a technology conference: a 5-question, bilingual (PT/EN), timed quiz on Platform Engineering and AI. It is a static SPA in kiosk mode on an iPad, published on GitHub Pages. Nothing goes to a server or a cloud: participant data lives in the iPad's `localStorage`, and staff download it as CSV.

The app is public, so a team login comes first: a team member signs in with one of two fixed accounts, and then participants play without interruption until the team signs out from the staff panel.

The specification is in `.claude/aidlc-docs/` (AI-DLC method). Read `.claude/aidlc-docs/README.md` for gate status before starting a unit. Where `.claude/skills/quiz.md` and `.claude/aidlc-docs/` disagree, `.claude/aidlc-docs/` wins, and the disagreement should be fixed in the same change. Quality bar: `.claude/skills/DEFINITION_OF_DONE.md`.

# Working method (AI-DLC)

- **Inception** (in `.claude/aidlc-docs/inception/`): intent, requirements, stories, units and bolts, architecture, open questions. Every artifact is a draft until its owner approves it. Mark gates in `.claude/aidlc-docs/README.md` only when approved.
- **Construction**, per unit: functional design, then NFR check, then code, then build and test. Do not write code for a unit while its questions in `06-open-questions.md` are unanswered.
- **Operations**: event runbook, publish, CSV export, data deletion.
- Log each AI-assisted step in `.claude/aidlc-docs/audit.md`. InfoSec requires this.
- If the spec and the code disagree, say so in the reply. Do not change one silently to match the other.

# Brand (CRITICAL)

- **Company name:** always "Thoughtworks" (capital T, lowercase w). Never "TW" or "ThoughtWorks" in the UI.
- **Logo:** `/thoughtworks` with the Flamingo Pink oblique `/`, followed by the descriptor `Design. Engineering. AI.`
- **Typography:** headlines in Bitter Bold, sentence case only. Body and subheadings in Inter (Regular and SemiBold).
- **Colors:** only the tokens in `app/src/styles/tokens.css` (checked by `guardrails.test.js`). Never raw hex values.

# Engineering rules

1. **Kiosk UI:** tap targets at least 48x48px. No pinch-to-zoom and no overscroll bounce in CSS.
2. **State:** keep the data layer (questions, participants, session) separate from UI rendering.
3. **Bilingual:** all text lives in a dictionary, with PT and EN switchable instantly.
4. **Passwords:** never written in code, tests, docs or logs. Staff accounts store only a salt and a PBKDF2 hash (`app/src/content/staff-accounts.js`), generated with `npm run account:new`. Never store a password, not even temporarily.
5. **Personal data:** tests and docs use placeholders only (`participante@example.com`, `Equipe 1`). Never copy real participant data or staff passwords into the repo, logs or chat.
6. **No network data:** nothing about participants leaves the device. No third-party script, font, or API. The CSP stays strict.

# Commands

The app lives in `app/`. Run everything from there.

- `npm run dev`: Vite dev server.
- `npm test`: unit, use-case and guardrail tests (Node's built-in runner, no extra deps). One file: `node --test tests/csv.test.js`. One test: `node --test --test-name-pattern="formula" tests/csv.test.js`.
- `npm run build`, then `npm run check:budget`: production build and bundle budget.
- `npm run verify`: the full local gate (test, build, budget, audit). Run it before calling work done.
- `npm run account:new -- <email> "<label>"`: prints a staff account entry from a password read on stdin (`read -s PW && printf '%s' "$PW" | npm run account:new -- ...`).
- Publishing: `/publish-github-pages` (skill in `.claude/skills/publish-github-pages`). Trunk-based: short-lived branch, pull request with the `verify` check, squash merge to `main`, which deploys through `.github/workflows/pages.yml`. Never push to `main` directly and never edit the workflows to skip `verify`. Pages is public: the first publish needs the InfoSec approval recorded in `PUBLISHING.md`, which does not exist yet.
- Skills in `.claude/skills` (brand, InfoSec guardrails, quiz spec) apply to all work here.

# Architecture (in `app/src`)

Layered core plus lazily loaded feature micro-frontends. No UI framework. The DOM is built with `kernel/dom.js` `h()`.
- `domain/`: pure rules (scoring, quiz state machine, registration validation, CSV, login lockout). No DOM, no packages.
- `application/create-quiz-app.js`: use-case facade for the quiz and the staff panel. `application/create-access-control.js`: the team login. Both talk to the outside only through the ports in `ports.js`.
- `infrastructure/`: adapters: `localStorage` repository, `localStorage` session store, PBKDF2 password check (WebCrypto), Tone audio, confetti, file download. Tone and confetti are dynamic imports.
- `features/<name>/index.js`: each exports `mount(host, ctx, props) -> dispose`. Features import only `kernel/`, never each other or infrastructure. `shell` mounts the others through the lazy registry in `composition/screens.js`. The first view is `login` when there is no team session.
- `composition/create-context.js`: the only place adapters are wired to the core.
- `content/`: static questions, PT/EN dictionaries, and the staff account list.

Rules enforced by `tests/guardrails.test.js` (a failing test means a rule was broken, not that the test is wrong): layer import directions, no `innerHTML`, no remote scripts or fonts, no em dashes or banned words in copy, kiosk CSS, brand colors, no secret-looking literals.

# Behavior to preserve

- **Login gate:** the first screen until a valid team account signs in. A generic error for a wrong email or password. Five failures lock the gate for 30 seconds.
- **No re-login while playing:** after a valid login, every run works without asking again, including "Próximo participante". The session survives a page reload and ends only with "Sair" in the staff panel (no inactivity timeout, by decision Q8).
- **Quiz:** 5 basic questions plus 2 advanced deck-based questions (7 total). Advanced ones come last and each has a source entry (deck slides) in `.claude/aidlc-docs/inception/07-advanced-content.md`; the test `advanced-content.test.js` enforces it. Correct answers spread over A to D, no letter more than twice, no repeat in a row. Scoring and streak rules in `domain/scoring.js`. The Thoughtworks insight appears after every answer.
- **Time:** each question has `QUESTION_TIME_SECONDS` (30 s). The value lives only in `domain/scoring.js` and reaches the UI through `app.questionTimeSeconds`. Never hardcode it. Use the `{seconds}` placeholder in copy.
- **Answer pop-up** (`features/feedback`): check (right), X (wrong), clock (timeout). It stays `pointer-events: none`, and works with reduced motion.
- **Staff panel:** opens by long-pressing the logo for 1.5 s, only inside a team session. It never shows email or phone. Delete-all needs a second tap. "Sair" ends the session.
- **CSV:** built from the `localStorage` records. UTF-8 with BOM, CRLF rows, PT headers, formula-injection protection. Do not reorder columns without telling the raffle owner.
- **Storage:** participants under `tw-platform-quiz:v1:participants`. Session under `tw-platform-quiz:v1:session`. Lockout under `tw-platform-quiz:v1:access-lockout`. Corrupt participant data is quarantined, never overwritten.
- **Strings:** a new UI string goes into both `messages.pt.js` and `messages.en.js`. A test fails if they differ.

# Status and known gaps

- Current state: the login gate, the local storage and the CSV are built and tested. Nothing is published. The team accounts are empty until someone generates them (`staff-accounts.js`), so the quiz stays locked until then.
- The login is a booth guard on a public site, not real security. Anyone who reads the code or edits `localStorage` can get past it. This is accepted in Q2 and must be stated to InfoSec.
- Publishing waits for the InfoSec approval recorded in Q1. The consent text and `privacyNote` were approved by the product owner (Q7): no legal review was requested. Anonymization of the data is not required for now (Q1).
- `.claude/skills/quiz.md` still describes the old flow. Update it with U3.
- `.harness/pipeline.yaml` is referenced but does not exist. CI is `.github/workflows/ci.yml`.
- Real iPad test is not done (`DEFINITION_OF_DONE.md` 5.5). SAST/DAST is not configured (6.8).
