# System architecture and data flow

## Production components

1. **Expo mobile client** records audio/video, supports Arabic RTL layouts, presents review questions, and guides the learner one step at a time.
2. **Authenticated API** issues short-lived upload URLs, authorises family-circle access, validates requests, and returns durable job IDs.
3. **Private object storage** keeps original recordings and attempt media encrypted at rest. Objects are never public.
4. **Background worker** transcribes, translates, and structures a lesson draft. Model responses pass schema, language, and content validation before display.
5. **Relational database** stores users, families, lessons, revisions, confirmations, attempts, feedback, consent, and deletion status.
6. **Notification service** announces attempts and replies without exposing private content in notifications.

## Data flow

1. The client records locally after explicit permission.
2. The API authenticates the member and returns a short-lived private upload URL.
3. The client uploads the original recording with resumable retry and stores its recording ID.
4. A background job produces a transcript, optional translation, materials, steps, cultural stories, and questions for missing details.
5. A validator rejects malformed output, unsupported fields, dangerous instructions, or content that cannot be traced to the transcript.
6. The elder compares the draft with the original, edits it, and confirms every step. Only then is it **family verified**.
7. A learner follows that confirmed revision and uploads an attempt.
8. The elder's reply links to both the attempt and lesson revision.
9. Deletion revokes access immediately and queues media/database erasure under the retention policy.

## Core records

- `FamilyCircle`: membership and role
- `Recording`: owner, encrypted object key, language, consent, processing state
- `Lesson`: type, current revision, verification state
- `LessonRevision`: transcript reference, translation, materials, steps, stories
- `Confirmation`: elder, field or step, timestamp
- `Attempt`: learner, lesson revision, private media, note, upload state
- `Feedback`: elder, attempt, media or text, inclusion-in-lesson state
- `CookingSession`: lesson revision, scheduled time, participants, roles, and shared progress

## Reliability requirements

- API keys live only in backend secrets; the app receives no provider credential.
- Uploads are resumable and expose queued, uploading, processing, needs-review, and failed states.
- A lost connection preserves the local recording and queues retry.
- Permission denial offers an audio-only or try-later path.
- Processing retries idempotently using the recording ID.
- The UI never displays unvalidated model output.
- The original recording remains available during review.
- Every media item has edit/delete controls and an auditable owner.

## Current prototype boundary

The repository implements the mobile interaction model. It records real video, but processing, durable storage, playback, uploads, authentication, notifications, and backend validation remain simulated. These are required before a family pilot.
