# Goal
Build a gamified, bilingual (PT/EN) web application for an iPad kiosk. The app is a quiz of 7 questions (5 basic and 2 advanced) capturing leads and educating attendees on Thoughtworks' Engineering de plataforma e AI.

# Core Requirements

## 1. Landing & Registration
- **UI:** Clean, brand-aligned welcome screen. Language toggle (🇧🇷 PT | 🇺🇸 EN) in the header.
- **Form:** Capture Name, Company, Role, Email, and Phone.
- **Consent:** Include a mandatory checkbox for data sharing (LGPD/GDPR compliance) to participate in the raffle.

## 2. Gamified Quiz Mechanics
- **Questions:** 7 questions about Platform Engineering & AI, in two levels:
  - **Basic (5):** short, high-impact questions. These are the questions the quiz has always had.
  - **Advanced (2):** harder questions taken from the Thoughtworks deck on Platform Engineering & AI. They come after the basic ones. They must be answerable by someone who read the deck. Each one has a source entry in `.claude/aidlc-docs/inception/07-advanced-content.md` that lists the deck slides behind it and any claim that goes beyond the deck. A test fails if an advanced question has no entry. Claims beyond the deck need the product owner's explicit approval.
  - The quiz supports 5 to 7 questions. A count of 5 means no advanced questions. A count of 7 means exactly 2 advanced questions, last.
- **Timer:** A 30-second animated countdown timer per question, defined by a single constant (`QUESTION_TIME_SECONDS`). If time runs out, mark as incorrect.
- **Answer Variation:** Correct answers are spread over the letters A to D. No letter is correct more than twice in the quiz, and two consecutive questions never share the same correct letter (the current order is C, A, D, B, C, B, D; the advanced questions keep the same rule).
- **Answer pop-up:** Immediately after answering, show an animated pop-up over the screen: a green check for a correct answer, a pink X for a wrong answer, and a yellow clock when time runs out. It disappears on its own after about 1.4 seconds, never blocks taps, and stays visible but static when the device requests reduced motion.
- **Thoughtworks Insights:** Immediately after answering (right or wrong), show a brief feedback overlay explaining Thoughtworks' perspective on that topic before moving to the next question.
- **Scoring:** A correct answer scores 1,000 points plus 50 per second left on the timer plus 150 per answer already in the current streak (up to 2,500 for a first-second answer without a streak). Wrong answers and timeouts score zero and reset the streak.

## 3. Results Screen
- Display the final score based on accuracy and speed.
- Show a congratulatory message and confetti animation.
- Display the exact text: "Ao finalizar o quiz, retire um brinde na mesa".
- Do NOT include a live leaderboard or QR codes on this screen.

## 4. Staff Panel & CSV Export
- Include a hidden/discrete button (e.g., a small gear icon or long-press logo) to open a Staff Dashboard.
- **Dashboard Features:**
  - View a table of all registered participants, their scores, and timestamps.
  - A button to **"Exportar CSV (.csv)"** that downloads all participant data in a UTF-8 formatted CSV file (vital for the post-event raffle).

## 5. Harness Engineering (CI/CD)
- Scaffold a `.harness/pipeline.yaml` file that defines a CI pipeline. The pipeline should:
  - Check out the codebase.
  - Run `npm install` and `npm test` (test harness).
  - Run `npm run build` to compile the static assets for deployment.

# Execution Steps for Claude
1. Initialize the project structure (HTML, CSS, JS/Vite).
2. Implement the Brand Design System (Colors, Fonts).
3. Build the bilingual dictionary and state management.
4. Implement the UI screens (Registration -> Quiz -> Results -> Staff Panel).
5. Generate the Harness pipeline configuration.