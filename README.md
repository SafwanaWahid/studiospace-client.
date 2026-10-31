# StudioSpace

Live site: TO BE ADDED AFTER DEPLOYMENT

A peer-to-peer creative workspace marketplace built for photography, filmmaking, podcasting, music, and workshops.

## Features

- Three-slide Swiper hero and MongoDB-powered featured studio collection.
- Category browsing, studio/location search, and hourly price sorting.
- Better Auth email/password and Google authentication with persistent sessions.
- Host-owned studio creation, image uploading, editing, and confirmed deletion dialogs.
- Detailed studio galleries, amenities, host profiles, availability, and reviews display.
- Booking requests, cancellation of pending reservations, and host confirmation/completion.
- HTTPOnly-cookie JWT authorization with server-side session and ownership checks.
- Transaction-based prevention of overlapping confirmed reservations.
- Persistent light/dark theme, responsive cards, skeletons, empty states, and custom 404.

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

## Examiner test credentials

Before submission, create two dedicated accounts on the live site and fill this in. No live accounts have been provisioned in this source package.

| Role | Email | Password |
| --- | --- | --- |
| Host | TO BE CREATED | TO BE CREATED |
| Creator | TO BE CREATED | TO BE CREATED |

Host: Dashboard → incoming bookings, My Studio Listings → update/delete. Creator: Explore Studios → details → request booking → My Bookings.

## Routes

`/`, `/studios`, `/studios/[id]`, `/login`, `/register`, `/how-it-works`, `/about`, `/terms`, `/dashboard`, `/add-studio`, `/my-listings`, `/my-bookings`, `/studios/edit/[id]`.

Private routes wait for the authentication session before deciding whether to redirect. The server independently authorizes access to private data and every mutation.

## Deployment

Deploy the server first. Set `API_SERVER_URL` on the client to the HTTPS server origin before building. On the server, set `CLIENT_URL` to the exact client origin. Configure Google's callback as `CLIENT_ORIGIN/api/auth/callback/google`. See the supplied START-HERE guide for the full sequence.

## Content and boundaries

Seed studios are illustrative and have no invented review scores. The app displays stored reviews but does not include a review-writing flow. No payment is processed. Optional PDF invoices and wishlists are not implemented. Newsletter, insurance coverage, and 24/7 staffed support are not represented as active services. Photos use Unsplash image URLs.
