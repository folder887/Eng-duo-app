# LinguaLeap - Build Instructions

## Quick Start (Web)

```bash
npm install --legacy-peer-deps
npx expo start --web
```

The web build is included in `dist/` and can be deployed to any static hosting.

## Native Builds (iOS & Android)

### Prerequisites
1. Create an [Expo account](https://expo.dev/signup)
2. Install EAS CLI: `npm install -g eas-cli`
3. Login: `eas login`

### Android APK (Preview)

```bash
eas build --platform android --profile preview
```

This creates a downloadable `.apk` file on Expo servers.
No Android Studio required — builds happen in the cloud.

### iOS Simulator Build

```bash
eas build --platform ios --profile development
```

### iOS Device Build (requires Apple Developer account)

```bash
eas build --platform ios --profile preview
```

### Production Builds

```bash
# Android App Bundle (.aab) for Google Play
eas build --platform android --profile production

# iOS for App Store
eas build --platform ios --profile production
```

## CI/CD (GitHub Actions)

The project includes a GitHub Actions workflow (`.github/workflows/build.yml`).

To enable cloud builds:
1. Go to your repo Settings > Secrets > Actions
2. Add `EXPO_TOKEN` — get it from https://expo.dev/settings/access-tokens
3. Push to `main` to trigger Android & iOS builds

## Web Deployment

The pre-built web version is in `dist/`. Deploy to:

- **GitHub Pages**: Push `dist/` contents to `gh-pages` branch
- **Vercel**: `npx vercel dist/`
- **Netlify**: Set publish directory to `dist/`

## Build Profiles

| Profile       | Android Output | iOS Output       | Use Case              |
|---------------|----------------|------------------|-----------------------|
| `development` | .apk           | Simulator build  | Development/testing   |
| `preview`     | .apk           | Ad-hoc .ipa      | Internal testing      |
| `production`  | .aab           | App Store .ipa   | Store submission      |
