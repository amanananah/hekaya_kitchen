# Testing evidence

## Automated checks

| Date | Revision | Check | Result |
| --- | --- | --- | --- |
| 2026-09-03 | working tree | `pnpm typecheck` | Pass |
| 2026-09-03 | working tree | Expo public configuration parse | Pass |

## Manual demonstration checklist

- [ ] Camera and microphone permission accepted
- [ ] Permission denial returns safely to capture intro
- [ ] A new video can be recorded and stopped
- [ ] Processing state appears before the lesson draft
- [ ] Elder review shows one large question at a time
- [ ] Voice correction and Ask Me Later paths work
- [ ] Skipped details prevent family-verified save
- [ ] Confirming all five steps enables save
- [ ] Cook Together displays participants and assigned kitchen roles
- [ ] Starting a family session carries shared status into the guided lesson
- [ ] Guided lesson shows one step and a progress indicator
- [ ] Original-voice and personalised Ask Teacher controls are reachable
- [ ] Learner can choose a photo or voice attempt
- [ ] Attempt appears privately in Family
- [ ] Elder response is added to the evolving lesson
- [ ] Search and category filtering still work
- [ ] Long Arabic text and RTL layout checked on a physical device
- [ ] Offline retry and deletion checked against the production backend

For every competition test run, record the device, OS version, tester, date, result, and issue link. Attach screenshots or short screen recordings to the release or a clearly named evidence folder.
