---
name: aidlc-workflow
description: Navigate and maintain the AI-DLC specification in .claude/aidlc-docs/. Reports gate status and open questions, records AI-assisted steps in the audit log, and refuses to start construction of a unit whose gate or questions are not closed. Use when the user asks what is next, what is blocked, the project status, to update the spec, to close a gate, or to log AI work.
---

# AI-DLC workflow

The spec lives in `.claude/aidlc-docs/`. Start every session on this skill when the task touches planning, status or gates. Read `.claude/aidlc-docs/README.md` first; it holds the gate table.

## Source of truth

- Gates and status: `.claude/aidlc-docs/README.md`.
- Requirements: `inception/02-requirements.md` (FR-xx, NFR-xx IDs).
- Stories: `inception/03-user-stories.md` (US-xx).
- Units and bolts: `inception/04-units-and-bolts.md` (U1 to U3, B1 to B3).
- Architecture: `inception/05-architecture.md`.
- Open questions: `inception/06-open-questions.md` (Q1 to Q14, answered in `[Answer]:`).
- Audit: `audit.md`.

If the spec and the code disagree, report both and ask which one changes. Do not edit either silently.

## Procedure: status request

1. Read the gate table and `06-open-questions.md`.
2. Report: each gate (G1 to G5) with its state, the unanswered questions that block it (by ID), and the next unit that can start.
3. Separate blockers from important questions, as the file does.

## Procedure: answering a question

1. Copy the user's answer into the matching `[Answer]:` line, verbatim. Keep their wording.
2. If the answer changes a requirement, story, unit or architecture decision, update that file in the same change and name each file you touched.
3. Add an `audit.md` row for the change.
4. Re-check which units are now unblocked.

## Procedure: closing a gate

Gates change only when a named human approves. Never close a gate because a document looks finished.

1. Confirm the approver and the date with the user.
2. Set the state in `.claude/aidlc-docs/README.md` to "Aprovado" with the date and approver name as given. Never invent an approver.
3. Record the approval in `audit.md`.

G4 (security) also needs the InfoSec reference from the user (ticket, email or wiki link). Without it, leave G4 open and say so.

## Audit log

Every AI-assisted step gets a row in `audit.md`: date, phase, what was generated, who reviewed it, and state. Do not log personal data, passwords, project IDs or staff emails there. Review state stays "Pendente" until a person reviews it.

## Hard rules

- No unit is built while its gate (G3, or G4 before publishing) is open, or while its blocking questions are unanswered.
- Do not change a requirement ID's meaning. Add a new ID and mark the old one superseded.
- Keep the Portuguese language of the spec. Write the audience line ("Escrito para: ...") at the top of each new document.
- Documents are drafts from the AI until a person approves them. Say so in the output.

> This skill and the documents it maintains are AI-generated. They require human review before any gate is closed.
