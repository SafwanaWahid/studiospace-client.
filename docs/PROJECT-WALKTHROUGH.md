# StudioSpace — understand and demonstrate the project

## What the application does

A host publishes a studio, sets its hourly rate and deposit, and handles incoming requests. A creator discovers a space and requests future hours. The host can confirm the request; the server refuses conflicting confirmed reservations.

## Where the code lives

| Concern | Main files |
| --- | --- |
| Home and category/location search | client `components/home.tsx` |
| Shared navigation and theme | client `components/shell.tsx` |
| Login and registration | client `components/auth-page.tsx`, `lib/auth-client.ts` |
| API request and cookie access helper | client `lib/api.ts` |
| Studio creation and editing | client `components/studio-form.tsx` |
| Studio gallery and booking modal | client `components/details.tsx` |
| Listings, bookings, host dashboard | client `components/account-pages.tsx` |
| Better Auth MongoDB configuration | server `auth.js` |
| Session, origin, and JWT checks | server `security.js` |
| Studio API | server `routes/studios.js` |
| Booking and overlap rules | server `routes/bookings.js` |
| Validation functions | server `domain.js` |
| ImgBB upload proxy | server `routes/upload.js` |

## Six decisions to be able to explain

**Why two projects?** The assignment requires a separate Next.js client and Express API. Next rewrites forward `/api/*` requests to Express while browsers continue using the client origin.

**Why both a session and a JWT?** Better Auth manages identity and persistent sessions. Protected mutations additionally require a short-lived JWT in an HTTPOnly cookie. The server compares the token subject to the active session user; browser-supplied emails cannot establish ownership.

**What is the overlap condition?** An existing Confirmed session overlaps when its start is earlier than the requested end and its end is later than the requested start. Strict inequalities allow back-to-back sessions.

**Why a transaction?** A check followed by an independent insert or update is vulnerable to concurrent requests. Confirmation writes to the shared studio document and checks existing confirmations inside a MongoDB transaction. Competing confirmations conflict and retry against the committed result.

**Why can two Pending requests overlap?** Pending is a request, not a reserved time slot. The assignment says Confirmed bookings block overlaps. Only one of those conflicting requests can subsequently be confirmed.

**Why wait before redirecting private pages?** A page refresh starts while session data is still loading. The guard waits for a completed session check before sending a logged-out user to Login.

## A short demonstration

1. Search from Home by category and location.
2. Show a studio's images, amenities, price, deposit, and availability.
3. Register/login as a creator and request future hours.
4. Open the host account's Dashboard and confirm.
5. Refresh the creator's booking list to show the changed status.
6. Request overlapping confirmed hours and show the server's rejection.
7. Demonstrate a pending cancellation, studio edit, and deletion confirmation.
8. Refresh a private page while signed in, toggle the theme, and demonstrate mobile navigation.

## Repeatable checks

Client: `npm run lint`, `npm run build`, and `npm run test:ui` after installing its Playwright browser. The UI suite uses test fixtures so it can run without external service credentials. Stop any existing client dev server before the UI test.

Server: `npm test` runs the six domain tests. `npm run test:integration` additionally starts an isolated temporary MongoDB replica set and tests real authentication, CRUD, ownership, cookie access, cancellation, and concurrent confirmation.

Google OAuth, actual ImgBB uploads, and the final deployed origins must still be tested using your accounts. Do not describe those deployment checks as completed until you have performed them.
