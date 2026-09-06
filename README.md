# Hekaya Kitchen · حكاية

**A human-led intergenerational cooking platform that helps families preserve, practise, and pass down treasured recipes together.**

Hekaya Kitchen is built around people teaching people. A family cook records a natural cooking demonstration, reviews the resulting lesson, and remains the trusted teacher. Speech and translation tools reduce the work of writing everything down; they do not replace the family's knowledge, decisions, or relationships. A younger relative can then follow the recipe, share an attempt, and receive feedback that becomes part of the evolving lesson.

> Elder teaches → younger relative practises → elder responds → family knowledge continues.

## What this prototype proves

- Native React Native and Expo mobile experience, not a WebView
- Real camera and microphone permission flow, video recording, and playback of the captured cooking clip
- Elder-friendly, voice-first capture with large controls and minimal typing
- Dedicated Easy Mode with only three large actions: record, review, and reply
- A persistent Arabic/English choice across Easy Mode, review, and reply screens
- One large teacher-confirmation question at a time, with voice correction and no invented confidence score
- Arabic and English lesson status, original-voice playback entry points, and visual checkpoints
- One-step-at-a-time guided learning
- Cook Together sessions with participants, simple kitchen roles, and shared progress
- Private attempt sharing with a photo or voice-message choice
- Elder encouragement saved back into the family lesson
- Searchable family lesson collection

The current repository is a polished local demonstration. Camera recording and local playback use the real captured video. The processing result, learner attachment, and feedback persistence are simulated in memory, so the full journey can be demonstrated without pretending that a production backend already exists.

## Run locally

Requirements: Node.js 20+, pnpm, and Expo Go or a mobile simulator.

```powershell
pnpm install
pnpm start
```

Scan the QR code with Expo Go. The app requests camera and microphone permission only when recording starts.

Useful checks:

```powershell
pnpm typecheck
pnpm doctor
```

## Demonstration script

1. On Home, choose **Easy Mode** to open the distraction-free, accessible experience.
2. Switch to Arabic if needed, then choose **Record a recipe**.
3. Record a real Luqaimat demonstration and stop it.
4. Replay the exact captured video, check its picture and sound, then choose **Use this recording**.
5. Review the organised draft one question at a time. Confirm each step or demonstrate a voice correction.
6. Save the family-verified lesson and open it.
7. Open **Cook together**, show the three participants and their kitchen roles, then start the shared lesson.
8. Move through one checkpoint at a time, play the teacher's original voice, and use the personalised **Ask [teacher]** action.
9. Share a photo or voice attempt.
10. Return to Easy Mode and choose **Reply to Amanah**. Send a one-tap or recorded response and show that it becomes part of the lesson.

## How technology supports the family

The family's knowledge is the source of every lesson. Supporting tools help with speech transcription, Arabic–English translation, structuring materials and steps, and identifying details for the teacher to confirm. Every output remains a draft until a person reviews it.

Hekaya Kitchen does not claim to measure ingredients, judge dough or food quality, recognise live cooking actions, calculate meaningful confidence percentages, or give autonomous safety-critical recommendations. The production design retains the original recording so family members can compare the draft with its human source.

## Production architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the proposed system, validation gates, privacy controls, failure handling, and data flow. No API keys or credentials belong in this repository; production secrets must remain in a backend secret manager.

## Evidence and project records

- [Architecture and data flow](docs/ARCHITECTURE.md)
- [Testing evidence](docs/TESTING.md)
- [Privacy decisions](docs/PRIVACY.md)
- [Human-led development and assistance record](docs/AI_USAGE.md)
- [Team responsibilities](docs/TEAM.md)

Commit authorship should use each member's own Git identity. The team should commit in small, reviewable increments and update the evidence documents as the implementation changes.

## Build an Android APK

The private GitHub Actions workflow can create a standalone APK: open **Actions**, choose **Build installable Android app**, run the workflow, then download the **Hekaya-Kitchen-Android-APK** artifact.

With an Expo account, the included EAS profile can also create a preview APK:

```powershell
npx eas-cli@latest build --platform android --profile preview
```

Apple distribution requires Apple Developer credentials.
