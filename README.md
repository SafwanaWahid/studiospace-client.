# StudioSpace

Live site: https://studiospace-client-murex.vercel.app/

A peer-to-peer creative workspace marketplace built for photography, filmmaking, podcasting, music, and workshops.

## Features

* Three-slide studio photography hero with working category/location search and MongoDB-powered featured studios.
* Category browsing, studio/location search, and hourly price sorting.
* Better Auth email/password and Google authentication with persistent sessions.
* Host-owned studio creation, image uploading, editing, and confirmed deletion dialogs.
* Detailed studio galleries, amenities, host profiles, availability, and reviews display.
* Booking requests, cancellation of pending reservations, and host confirmation/completion.
* HTTPOnly-cookie JWT authorization with server-side session and ownership checks.
* Transaction-based prevention of overlapping confirmed reservations.
* Persistent light/dark theme, locally bundled fonts and photographs, responsive cards, skeletons, empty states, and custom 404.
* Repeatable 18-check browser review covering discovery, authentication guards, hosting forms, dialogs, and mobile layouts.

## Tech stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn-style Radix/Slot Button, Sonner, Swiper, Lucide, next-themes. Separate Express API with MongoDB and Better Auth MongoDB adapter.

## Local setup

Requires Node.js 22+ and npm. In this folder:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Start the separately supplied server on port 5000. Open http://localhost:3000. `.env.local` contains `API\\\\\\\_SERVER\\\\\\\_URL=http://localhost:5000`. Do not place credentials in NEXT\_PUBLIC variables.

## Checks

```powershell
npm run lint
npm run build
```

Browser checks (stop the dev server first):

```powershell
npx playwright install chromium
npm run test:ui
```

The UI suite starts its own local Next server and uses isolated API fixtures. It tests UI behavior without Google, ImgBB, or Atlas credentials. Real database/authentication behavior is covered by the server integration suite.

## Design and assets

The visual identity uses Manrope and Bricolage Grotesque, ink/off-white/lime colors, studio photography, and search-first navigation. Font license files are bundled in `app/fonts`; photo credits are in `public/media/CREDITS.md`. Peerspace, Giggster, and public Stuvia/Studiro previews informed the original layout; commercial template code and screenshots are not included.

## Examiner test credentials

|Role|Email|Password|
|-|-|-|
|Host|safwanazuha@gmail.com|Idkidkidk|
|Creator|safwanabintuwahid@gmail.com|xaT4MFNaN4ierFK|

Host: Dashboard → incoming bookings, My Studio Listings → update/delete. Creator: Explore Studios → details → request booking → My Bookings.

## Routes

`/`, `/studios`, `/studios/\\\\\\\[id]`, `/login`, `/register`, `/how-it-works`, `/about`, `/terms`, `/dashboard`, `/add-studio`, `/my-listings`, `/my-bookings`, `/studios/edit/\\\\\\\[id]`.

Private routes wait for the authentication session before deciding whether to redirect. The server independently authorizes access to private data and every mutation.

## Deployment

Deploy the server first. Set `API\\\\\\\_SERVER\\\\\\\_URL` on the client to the HTTPS server origin before building. On the server, set `CLIENT\\\\\\\_URL` to the exact client origin. Configure Google's callback as `CLIENT\\\\\\\_ORIGIN/api/auth/callback/google`. See the supplied START-HERE guide for the full sequence.

## Content and boundaries

Seed studios are illustrative and have no invented review scores. The app displays stored reviews but does not include a review-writing flow. No payment is processed. Optional PDF invoices and wishlists are not implemented. Newsletter, insurance coverage, and 24/7 staffed support are not represented as active services. Photos use Unsplash image URLs.

## Verified revision

Production build and lint pass. The browser review has 18 passing checks with explicit API fixtures. Separate API integration and full-stack browser-to-database checks passed against a temporary MongoDB replica set. Google OAuth and the deployed client/server origins have been tested. Real ImgBB file uploads still need configuration and live verification.
