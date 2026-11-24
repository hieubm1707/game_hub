# Firebase Setup Guide

## 1. Local Development (Emulator Suite)

No production Firebase account is required for local development.

```bash
pnpm emulators:start
pnpm emulators:seed
```

Copy `.env.example` to `apps/hub/.env.local` and keep `VITE_USE_FIREBASE_EMULATORS=true`.

## 2. Production Setup (Firebase Spark Plan — $0/month)

1. Create a Firebase project on the **Spark (Free)** billing plan. Do **not** upgrade to Blaze.
2. Enable **Cloud Firestore** (production mode).
3. Enable **Firebase Authentication** -> **Email/Password** (and optionally Google Sign-In). Do **not** enable Phone/SMS auth.
4. Disable public sign-up in the Hub (no registration UI exists). Create your initial administrator user in Firebase Console -> Authentication -> Users and note the `UID`.
5. Provision the initial owner in Firestore Console by creating `admins/{UID}`:
   ```json
   {
     "role": "owner",
     "enabled": true
   }
   ```
   Client SDKs cannot write to `admins/{uid}` by design.
6. Deploy Firestore Rules and indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes --project <YOUR_PROJECT_ID>
   ```
7. Configure `apps/hub/.env.local` (or Cloudflare Pages environment variables) with your public Firebase Web SDK config and set `VITE_USE_FIREBASE_EMULATORS=false`.
8. Routine game management now happens entirely in `/admin` without touching Firebase Console.
