# RCCG Glory of God Parish, Exeter

Next.js (App Router) website with a **Firebase backend** — Firestore for content and
prayer requests, Storage for photos and video, Auth for the admin panel.

It also runs with **no Firebase at all**, reading the JSON files in `/content`, so you
can start the project and debug the front end before any credentials exist.

---

## Run it

```bash
npm install
cp .env.example .env
npm run dev               # http://localhost:3000
```

Without Firebase values in `.env` the site reads `/content/*.json` and `/admin` is
locked. To edit content offline, set `ALLOW_LOCAL_ADMIN=true` in `.env` — that flag
is ignored in production builds.

Production:

```bash
npm run build
npm run start
```

---

## Firebase setup

### 1. Create the project
[console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
Then enable, in the left sidebar:

- **Firestore Database** → Create database → production mode
- **Storage** → Get started
- **Authentication** → Sign-in method → **Email/Password** → Enable

### 2. Server credentials
Project settings → **Service accounts** → *Generate new private key*. From the JSON
file that downloads, copy three values into `.env`:

```
FIREBASE_PROJECT_ID=rccg-exeter
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@rccg-exeter.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=rccg-exeter.firebasestorage.app
```

Keep the private key on one line, in quotes, with the `\n` escapes exactly as the
JSON gives them. The app converts them back to newlines.

Never commit this file — `.env` is already in `.gitignore`.

### 3. Browser credentials
Project settings → **General** → Your apps → Web app → Config. Copy those six values
into the `NEXT_PUBLIC_FIREBASE_*` variables. These are meant to be public; the
Firestore and Storage rules are what protect your data.

### 4. Admin accounts
Authentication → **Users** → Add user (email + password) for each person who should
manage the site. Then list the same addresses in `.env`:

```
ADMIN_EMAILS=pastor@rccgexeter.org,media@rccgexeter.org
```

Anyone not on that list is rejected even with a valid Firebase login.

### 5. Seed the content
Pushes all ten JSON files into Firestore:

```bash
npm run seed
```

Safe to re-run — it overwrites the ten documents under `content` and never touches
prayer requests.

### 6. Publish the rules

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage,firestore:indexes
```

Before you do, open `storage.rules` and replace the two example emails with your real
admin addresses — that list controls who can upload.

---

## How the data is laid out

**Firestore**

```
content/site          → address, phones, service times, bank details, stats
content/media         → every image and video URL
content/pages         → headings and body copy
content/ministries    → { items: [ ... ] }
content/events        → { items: [ ... ] }
content/sermons       → { items: [ ... ] }
content/gallery       → { items: [ ... ] }
content/team          → { items: [ ... ] }
content/testimonies   → { items: [ ... ] }
content/blog          → { items: [ ... ] }

prayerRequests/{id}   → one document per submission
```

Ten documents instead of ten collections, fetched in a single `getAll()`, so a page
render is one round trip rather than dozens of reads. Comfortably inside the free
tier for a parish site.

**Storage**

```
media/images/<timestamp>-<name>.jpg
media/video/<timestamp>-<name>.mp4
```

**Security model** — the website talks to Firestore only through the Admin SDK on the
server, so `firestore.rules` denies all browser access to `prayerRequests` and makes
`content` read-only. Nothing sensitive is reachable from the client.

---

## Adding photos and video

Two ways, both fine:

**Through the admin panel** — `/admin` → **Photos & Video** → pick a file. It uploads
straight from the browser to Firebase Storage with a progress bar (so large hero
videos are no problem), then hands you the URL. Paste that URL into the matching key
in the JSON below it and save.

**Straight into the repo** — drop files into `public/media/images/` or
`public/media/video/` and reference them as `/media/images/welcome.jpg`. Good for
assets that never change.

Either way the key lives in the `media` document:

```json
{
  "heroVideo": "https://firebasestorage.googleapis.com/.../hero.mp4?alt=media&token=...",
  "heroPoster": "/media/images/hero-still.jpg",
  "welcome": "/media/images/congregation.jpg",
  "liveEmbed": "https://www.youtube.com/embed/VIDEO_ID"
}
```

Any key left as `""` renders an animated placeholder rather than breaking the layout.

**Hero video** — MP4 (H.264) or WebM, ideally under 10 MB and 10–20 seconds; it loops.
It autoplays muted because browsers require that, and a sound toggle appears
top-right. Set `heroPoster` for the frame shown while it loads.

**Live stream** — fill in `liveEmbed` and `/live` swaps the placeholder for the real
player.

The demo video and 59 images currently in `public/media` are generated stand-ins.
Replace them with the parish's own photography.

---

## The admin panel

`/admin`, signed in with a Firebase Auth email and password.

**Prayer Requests** — every submission, newest first, straight from Firestore. Shows
the sender, subject, whether they ticked *confidential*, and the message. Mark each
*Praying* or *Answered*, or delete it.

**Content tabs** — the ten documents above, edited as JSON and written to Firestore.
Invalid JSON is rejected before saving, so a typo cannot break the site. Each save
calls `revalidatePath("/", "layout")`, so pages pick up the change on their next
request without a redeploy.

Service times drive the live countdown in the hero. `day` is `0` for Sunday through
`6` for Saturday, and `hour`/`minute` are **Europe/London**, so the counter stays
correct through the clock change.

---

## Prayer requests — how they flow

1. Someone submits `/prayer` or the form on `/contact`.
2. `POST /api/prayer` validates, drops bot submissions via a hidden honeypot field,
   and writes a document to `prayerRequests`.
3. If email is configured, a copy is sent immediately.
4. It appears in `/admin` → **Prayer Requests**.

Saving never depends on email — if the send fails, the request is still stored.

### Email notifications (optional)

Create a free account at [resend.com](https://resend.com), verify your domain, then:

```
RESEND_API_KEY=re_xxxxxxxx
PRAYER_TO_EMAIL=prayer@rccgexeter.org
PRAYER_FROM_EMAIL=website@rccgexeter.org
```

Leave `RESEND_API_KEY` blank and requests are simply stored.

---

## Structure

```
content/              Seed JSON — also the offline fallback
data/                 Local prayer requests when Firebase is off (gitignored)
public/media/         Photos and video served from the app itself
scripts/seed.mjs      Pushes /content into Firestore
firestore.rules       Locks Firestore to server-side access
storage.rules         Public read, admin-only upload
src/
  lib/
    firebase-admin.js  Admin SDK — Firestore, Auth, Storage (server only)
    firebase-client.js Client SDK — Auth and Storage (browser)
    content.js         All reads/writes, with the JSON fallback
    auth.js            Session cookies and the admin allowlist
  app/
    layout.jsx         Header, footer, global effects
    page.jsx           Home
    <route>/           One folder per page
    admin/             CMS
    api/
      prayer/          Public submission endpoint
      auth/session/    Login (POST) and logout (DELETE)
      admin/           Content read/write, prayer inbox, server-side upload
  components/
    Media.jsx          Every photo/video slot, with placeholder fallback
    Hero.jsx           Video hero + sound toggle
    Effects.jsx        Scroll reveals, split headings, counters, tilt, parallax
    PrayerForm.jsx     The form, used on two pages
    MediaUploader.jsx  Direct-to-Storage upload with progress
    AdminDashboard.jsx
  app/globals.css      The entire design system
```

---

## Debugging notes

- **`Firebase Admin is not configured`** — one of the three service-account variables
  is missing, or the private key lost its quotes. The site keeps working from
  `/content` and logs the reason; check `.env` and restart.
- **`error:0909006C:PEM routines`** — the private key's `\n` escapes were mangled.
  Re-copy it from the service-account JSON, keeping the surrounding double quotes.
- **Content edits not showing** — in dev they appear on refresh. In production the
  save revalidates automatically; if you are behind a CDN, give it a moment.
- **`storage/unauthorized` on upload** — your email is not in `storage.rules`, or the
  rules were never deployed. Update the list and run `firebase deploy --only storage`.
- **Signed in but still rejected** — the account exists in Firebase Auth but is not in
  `ADMIN_EMAILS`.
- **Images not showing** — the path must start with `/media/` (local) or be a full
  Storage URL including its `?alt=media&token=...`.
- **Hero video not playing** — it must be muted to autoplay, and H.264 MP4. Phone
  exports are often HEVC, which Chrome will not play:
  `ffmpeg -i in.mov -c:v libx264 -pix_fmt yuv420p -crf 26 out.mp4`
- **Animations not running** — they respect `prefers-reduced-motion`. Turn off
  "reduce motion" in your OS settings.

---

## Deploying

With Firebase doing the persistence, this deploys anywhere — Vercel, Netlify, Cloud
Run, a VPS. Nothing writes to the local filesystem in production.

On Vercel: add every variable from `.env` under Settings → Environment Variables.
Paste the private key including its quotes and `\n` escapes.

---

## Before going live

- [ ] Firestore, Storage and Email/Password auth enabled
- [ ] `.env` filled in, `ALLOW_LOCAL_ADMIN` left `false`
- [ ] `npm run seed` run once
- [ ] `firestore.rules` and `storage.rules` deployed, with real admin emails in Storage
- [ ] Admin accounts created and listed in `ADMIN_EMAILS`
- [ ] Demo photos and hero video replaced with the parish's own
- [ ] Real bank details in the `site` document
- [ ] YouTube embed URL in `liveEmbed`
- [ ] Real social links in the `site` document
- [ ] Invented parish team names in `team` replaced
- [ ] Testimonies confirmed with the people quoted
- [ ] `rccgexeter.org` pointed at the new host
# rccgexeter
