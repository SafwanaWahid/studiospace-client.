# StudioSpace

Live site: https://studiospace-client-murex.vercel.app/

A peer-to-peer creative workspace marketplace built for photography, filmmaking, podcasting, music, and workshops.

## Features

- Three-slide studio photography hero with working category/location search and MongoDB-powered featured studios.
- Category browsing, studio/location search, and hourly price sorting.
- Better Auth email/password and Google authentication with persistent sessions.
- Host-owned studio creation, image uploading, editing, and confirmed deletion dialogs.
- Detailed studio galleries, amenities, host profiles, availability, and reviews display.
- Booking requests, cancellation of pending reservations, and host confirmation/completion.
- Saved studios wishlist backed by the server API.
- Printable booking invoices for confirmed or completed reservations. Invoices show an estimate; the app does not process payments.
- HTTPOnly-cookie JWT authorization with server-side session and ownership checks.
- Transaction-based prevention of overlapping confirmed reservations.
- Persistent light/dark theme, locally bundled fonts and photographs, responsive cards, skeletons, empty states, and custom 404.
- Repeatable 18-check browser review covering discovery, authentication guards, hosting forms, dialogs, and mobile layouts.

## Tech stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn-style Radix/Slot Button, Sonner, Swiper, Lucide, next-themes. Separate Express API with MongoDB and Better Auth MongoDB adapter.

## Local setup

Requires Node.js 22+ and npm. In this folder:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Start the separately supplied server on port 5000. Open http://localhost:3000. `.env.local` contains `API_SERVER_URL=http://localhost:5000`. Do not place credentials in NEXT_PUBLIC variables.

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

The assignment asks for examiner credentials in this README. Use dedicated live accounts with no personal data, then enter their current sign-in details in the submission copy of this table.

| Role | Email | Password |
| --- | --- | --- |
| Host | safwanazuha@gmail.com | Idkidkidk |
| Creator | safwanabintuwahid@gmail.com | xaT4MFNaN4ierFK |

Host: Dashboard → incoming bookings, My Studio Listings → update/delete. Creator: Explore Studios → details → request booking → My Bookings.

## Routes

`/`, `/studios`, `/studios/[id]`, `/login`, `/register`, `/how-it-works`, `/about`, `/terms`, `/dashboard`, `/add-studio`, `/my-listings`, `/my-bookings`, `/studios/edit/[id]`.

Private routes wait for the authentication session before deciding whether to redirect. The server independently authorizes access to private data and every mutation.

## Deployment

Deploy the server first. Set `API_SERVER_URL` on the client to the HTTPS server origin before building. On the server, set `CLIENT_URL` to the exact client origin. Configure Google's callback as `CLIENT_ORIGIN/api/auth/callback/google`. See the supplied START-HERE guide for the full sequence.

## Content and boundaries

Seed studios are illustrative and have no invented review scores. Cards label unrated listings as “New”; the app displays stored reviews but does not include a review-writing flow. No payment is processed. Newsletter, identity verification, liability insurance, and 24/7 staffed support are not represented as active services. Confirm equipment, access, and safety details with each host. Photos use Unsplash image URLs.

## Verified revision

Production build and lint passed in the prior project review. The browser review has 18 passing checks with explicit API fixtures. Separate API integration and full-stack browser-to-database checks passed against a temporary MongoDB replica set. The deployed home, studio listing, studio details route, and server health endpoint were checked on 3 November 2026. Google OAuth and deployed origins were previously tested. ImgBB uploads require the server-side `IMGBB_API_KEY`; verify an actual upload on the live site before submission.
