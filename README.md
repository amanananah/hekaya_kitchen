# Mirath · ميراث

Mirath is a native mobile family-heritage app that helps elders pass down the unwritten knowledge behind traditional recipes. A family member records a natural cooking demonstration; Mirath turns it into visual checkpoints, family stories, and a guided lesson for the next generation.

> Preserve more than ingredients. Pass down the instinct.

## Native mobile milestone

- Built with React Native and Expo—not a website or WebView
- Records real video and audio with the phone camera
- Demonstrates capture, recipe extraction, and Grandchild Mode
- Includes a searchable five-recipe family archive with recipe-specific stories and coaching
- Configured for Android APK and iOS builds
- Uses the native application ID `ae.mirath.app`

The extraction screen currently uses a short simulated analysis step. Connecting the recorded video to a secure AI service is the next backend milestone.

## Run on a phone during development

Install the dependencies and start Expo:

```powershell
pnpm install
pnpm start
```

Scan the QR code with Expo Go on Android or the Camera app on iPhone. The camera experience is native and asks for device permissions.

## Create a downloadable Android APK

The repository includes a private GitHub Actions workflow that builds a standalone APK without an Expo account:

1. Open the repository's **Actions** tab.
2. Choose **Build installable Android app**.
3. Select **Run workflow**.
4. When it finishes, download the **Mirath-Android-APK** artifact.

The artifact contains `Mirath-preview.apk`, ready to install on an Android phone after allowing installs from the browser or Files app. It is an internal-testing build, not the final Play Store release.

### Expo cloud alternative

Sign in to an Expo account, then run:

```powershell
npx eas-cli@latest build --platform android --profile preview
```

The `preview` profile in `eas.json` produces an installable `.apk` file for judges and testers. For a Google Play release, use the `production` profile, which produces an Android App Bundle (`.aab`):

```powershell
npx eas-cli@latest build --platform android --profile production
```

iOS builds are also configured, but Apple distribution requires Apple Developer credentials.

## Product roadmap

1. Securely upload recordings and run speech/vision extraction.
2. Let the elder confirm uncertain quantities and visual checkpoints.
3. Add Arabic localization and family invitations.
4. Store encrypted family archives with consent and deletion controls.
5. Validate the experience with elders and younger family members.
