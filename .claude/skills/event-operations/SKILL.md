---
name: event-operations
description: Run the quiz at the booth - iPad setup, team sign-in, daily CSV export, what to do when the iPad or the storage misbehaves, the end-of-event export, and deleting the data on the iPad after the 2-day retention window. Use when the user asks for the event runbook, booth setup, the daily export, the end-of-event steps, or deleting event data.
disable-model-invocation: true
---

# Event operations (runbook)

This is the Operations phase for the booth. The data lives only on the iPad, in `localStorage`. There is no cloud copy, so the CSV export is the only backup. Keep the steps short and in Portuguese.

`disable-model-invocation` is set because deleting data is destructive and must be started by a person.

## Before the event

1. Open the public URL on the iPad in Safari, not a private tab (private tabs lose data on close).
2. Add the app to the Home Screen and open it from that icon.
3. Turn on Guided Access (Acesso Guiado) so participants stay in the app. Keep the passcode in the team's password manager, not on the device.
4. Turn auto-lock off while the booth is open, and keep the iPad charged.
5. Sign in with each team account once, then play one round, export the CSV, and check that the test row appears. Then sign out.
6. Delete the test row as a person, through the staff panel (delete-all), and confirm the list is empty.
7. Check the consent text on the device against the approved version (Q7). Do not run the booth with an unapproved text.

## During the event

1. Sign in with a team account. Once signed in, participants play without a new login, so the iPad stays unlocked for the whole day. Tap "Sair" only when the booth closes.
2. Export the CSV at every break and at the end of each day. Store each file outside the iPad, in the approved company folder.
3. Do not change the URL, clear Safari data, or use delete-all before the day's CSV is downloaded.
4. If the screen shows "Não foi possível salvar", ask the participant to wait, export the CSV now, note the participant's name on paper, and call the technical contact.
5. If the login says the account is locked, wait the time shown. Do not share one account between two people.

## After the event (retention: 2 days, Q9)

Event date: **07/11/2026**. Delete the iPad data no later than **09/11/2026**.

1. Export the final CSV. Count the rows against the number of participants you expect. Report any gap before deleting anything.
2. Store the final file in a private, access-controlled place approved by the company.
3. Use the newsletter list only for rows where "Aceitou_Newsletter" is "Sim".
4. By 09/11/2026 at the latest, tap "Sair", then sign in and use delete-all in the staff panel on this iPad. Confirm the list is empty.
5. Record the deletion date in `.claude/aidlc-docs/audit.md` (no personal data in the entry).
6. Automatic deletion inside the app is not built. It needs a new decision (Q9b).

## If something goes wrong

| Symptom | Action |
|---------|--------|
| The gate does not accept a team member | Check the email and the password with the account owner. After 5 wrong attempts, wait 30 seconds. |
| The CSV is empty or short | Do not delete anything. Check the list in the staff panel and export again. |
| The app shows an error after a restart | Do not reinstall. Open the staff panel and export the CSV first. |
| Storage is full or the save fails | Export the CSV at once. Tell the technical contact. |
| Someone else reached the staff panel | Tap "Sair" at once, and tell the data owner. Change the password with `npm run account:new`. |

## Who does what

- **Booth team:** setup, sign-in, daily export, storage of files, the save-failure procedure.
- **Technical contact:** the app, accounts, and publishing.
- **Data owner (Q9):** the final export check, the deletion date, and sign-off.

> The contents of this runbook are AI-generated. The data owner must approve them before the event.
