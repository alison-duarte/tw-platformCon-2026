# Definition of done

A change is done only when every item below is true. The last column says how each item is checked, so "done" does not depend on opinion. Run `npm run verify` from `app/` before you ask for review.

Sources: `.claude/skills/quiz.md` (product spec), `design-alltw-thoughtworks-brand/SKILL.md`, `design-alltw-thoughtworks-infosec-guardrails/SKILL.md`, and `CLAUDE.md`.

## 1. Product behavior

| # | Criterion | Checked by |
|---|-----------|-----------|
| 1.1 | Registration captures name, company, role, email and phone; all are required and validated | `participant.test.js`, manual run |
| 1.2 | The data sharing consent checkbox is mandatory; the newsletter checkbox is optional | `participant.test.js`, `quiz-app.test.js` |
| 1.3 | The quiz has 5 or 7 questions (7 = 5 basic plus 2 advanced, the advanced ones last), 30 seconds each (one constant, `QUESTION_TIME_SECONDS`); a timeout counts as incorrect | `content.test.js`, `quiz-app.test.js` |
| 1.4 | Correct answers spread over A to D: no letter correct more than twice, no two consecutive questions with the same letter | `content.test.js` |
| 1.4a | Every question has a `difficulty` of `basic` or `advanced`; advanced questions come last, and there are exactly 0 or 2 of them | `content.test.js` |
| 1.4b | Advanced questions come from the Thoughtworks deck, and their explanation does not add claims beyond the deck | content review by the product owner |
| 1.5 | Feedback with the Thoughtworks insight shows after every answer, right or wrong | manual run |
| 1.5a | A pop-up shows a check (right), an X (wrong) or a clock (time expired); it never blocks taps, removes itself after about 1.4s, and stays visible but static with reduced motion | manual run |
| 1.6 | Score = 1,000 + 50 per second left + 150 per streak step; tiers switch at 6,300 and 11,200 (scaled for 7 questions) | `scoring.test.js`, `quiz-session.test.js` |
| 1.7 | Results show the score, confetti, and the exact PT text "Ao finalizar o quiz, retire um brinde na mesa"; no leaderboard, no QR code | `content.test.js`, manual run |
| 1.8 | PT and EN are complete and switch instantly without losing form input or the running timer | `content.test.js`, manual run |
| 1.9 | Content is static: no remote fetches at runtime | `guardrails.test.js` |

## 2. Data storage and CSV export

| # | Criterion | Checked by |
|---|-----------|-----------|
| 2.1 | Each finished run is saved as one record on the device and survives a page reload | `repository.test.js`, `quiz-app.test.js` |
| 2.2 | A failed save is shown to the participant, never swallowed | `quiz-app.test.js` |
| 2.3 | Corrupt stored data is quarantined, not overwritten | `repository.test.js` |
| 2.4 | The staff panel opens only by a 1.5s long-press on the logo, and the table shows no email or phone | manual run |
| 2.5 | "Exportar CSV (.csv)" downloads UTF-8 with BOM, CRLF rows, agreed column order | `csv.test.js` |
| 2.6 | Spreadsheet formulas in text cells are neutralized | `csv.test.js` |
| 2.7 | Delete all data needs a second confirming tap | manual run |
| 2.8 | Staff data is rendered with text nodes only | `guardrails.test.js` (no `innerHTML`) |

## 3. Architecture

| # | Criterion | Checked by |
|---|-----------|-----------|
| 3.1 | `domain` has no DOM access and no package imports; `application` depends only on `domain` and `kernel` | `guardrails.test.js` |
| 3.2 | Features import only `kernel` and their own folder, never another feature or infrastructure | `guardrails.test.js` |
| 3.3 | Each feature exports `mount(host, ctx, props) -> dispose` and releases timers and listeners on dispose | code review |
| 3.4 | Adapters are wired only in `composition/`; swapping storage means writing one adapter against `ports.js` | code review |
| 3.5 | Features load lazily; Tone.js and confetti are dynamic imports | `check-budget.mjs` |
| 3.6 | New behavior lands in the right layer: rules in `domain`, orchestration in `application`, I/O in `infrastructure`, UI in a feature | code review |
| 3.7 | No UI framework is added; any new runtime dependency needs a written reason in the pull request | code review |

## 4. Brand (Thoughtworks brand skill)

| # | Criterion | Checked by |
|---|-----------|-----------|
| 4.1 | "Thoughtworks" is spelled correctly; never "TW" or "ThoughtWorks" | `guardrails.test.js` |
| 4.2 | The logo is the flamingo `/` plus `thoughtworks` and "Design. Engineering. AI." | manual run |
| 4.3 | Headlines use Bitter Bold in sentence case; body uses Inter | manual run |
| 4.4 | Only the seven brand colors are used, as tokens in `tokens.css` | `guardrails.test.js` (token check), code review |
| 4.5 | Copy has no em dashes and none of the banned words (leverage, empower, seamless, robust and similar) | `guardrails.test.js` |
| 4.6 | English copy uses US spelling, active voice, one through nine spelled out | code review against the brand checklist |

## 5. Kiosk and accessibility

| # | Criterion | Checked by |
|---|-----------|-----------|
| 5.1 | Every tap target is at least 48 by 48 px | `guardrails.test.js` (token), manual run |
| 5.2 | Pinch zoom, double-tap zoom and overscroll bounce are disabled | `guardrails.test.js` |
| 5.3 | Inputs have labels, errors are announced (`role="alert"`), the timer is a labeled progressbar, dialogs are native `<dialog>` | code review |
| 5.4 | Motion respects `prefers-reduced-motion`; confetti is skipped when it is set | code review |
| 5.5 | Verified on a real iPad in Safari, in landscape and portrait, including sound after the first tap and the CSV download | manual, **not yet done** |

## 6. Security and privacy (InfoSec guardrails skill)

| # | Criterion | Checked by |
|---|-----------|-----------|
| 6.1 | No secrets in code, config or tests; test data uses anonymised placeholders | `guardrails.test.js`, credential scan in CI |
| 6.2 | No runtime CDN scripts, styles or fonts; assets are bundled and self-hosted | `guardrails.test.js` |
| 6.3 | Production build ships a strict Content Security Policy; no `eval`, no `innerHTML` | `vite.config.js`, `guardrails.test.js` |
| 6.4 | `npm audit` reports no high or critical vulnerabilities; every new dependency is established, maintained and justified | CI audit step |
| 6.5 | The site is public on GitHub Pages; approval is recorded in `PUBLISHING.md` before the first publish | pipeline review with InfoSec |
| 6.6 | Participants see that data stays on the device and is used only for the prize draw and deleted after the event; the consent text matches the wording approved by the product owner (Q7) | manual |
| 6.7 | Staff export the CSV and delete device data after the event; a retention owner is named | event checklist, **owner to be named** |
| 6.8 | SAST and DAST scans run in the shared pipeline and pass | **not configured in this repo yet** |
| 6.9 | AI-generated code was peer reviewed (see the `code-reviewer` agent) and scanned before deployment | pull request checklist |
| 6.10 | The quiz stays locked until a team account signs in; with no accounts configured nobody gets in | `access.test.js`, `quiz-app.test.js`, browser smoke test |
| 6.11 | Passwords are never in code, tests or docs; accounts keep only a salt and a PBKDF2 hash | `staff-accounts.test.js`, code review |
| 6.12 | After a valid login, runs continue without a new login; only "Sair" ends the session | `quiz-app.test.js`, browser smoke test |

## 7. Quality gates

| # | Criterion | Checked by |
|---|-----------|-----------|
| 7.1 | `npm test` passes, including the guardrail tests | CI |
| 7.2 | A new rule or behavior comes with a test that fails without the change | code review |
| 7.3 | `npm run build` passes; first-paint JS is at most 40 kB gzip and CSS at most 8 kB | `check-budget.mjs` |
| 7.4 | No console errors or CSP violations in a full run on the production build | manual run |
| 7.5 | `.harness/pipeline.yaml` runs install, audit, credential scan, test, build and budget | CI |

## 8. Documentation and handover

| # | Criterion | Checked by |
|---|-----------|-----------|
| 8.1 | `CLAUDE.md` matches the commands and architecture | code review |
| 8.2 | A new UI string exists in both `messages.pt.js` and `messages.en.js` | `content.test.js` |
| 8.3 | The pull request lists what was verified, what was not, and any rule that was waived | pull request checklist |

> This code is AI-generated. It requires manual peer review and SAST/DAST scanning before deployment.
