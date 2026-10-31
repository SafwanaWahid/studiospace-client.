export const metadata = { title: "Terms & privacy" };
export default function Page() {
  return (
    <section className="container section prose">
      <p className="eyebrow">THE PRACTICAL DETAILS</p>
      <h1>Terms & privacy</h1>
      <h2>Assignment demonstration</h2>
      <p>
        StudioSpace is a student project. Sample studio listings are
        illustrative. This website does not collect payments or provide
        insurance or guaranteed support services.
      </p>
      <h2>Your account and listings</h2>
      <p>
        Use accurate account information and list only spaces you are authorized
        to share. Hosts are responsible for equipment descriptions, access
        arrangements, deposits, and any agreed terms.
      </p>
      <h2>Reservations</h2>
      <p>
        Booking requests begin as Pending and require host confirmation. Pending
        requests may be cancelled. Confirmed reservations are checked against
        other confirmed sessions.
      </p>
      <h2>Information we store</h2>
      <p>
        The application stores account details, studio listings, and
        reservations in MongoDB. Better Auth manages authentication. Uploaded
        images are stored by ImgBB. Authentication cookies keep you signed in; a
        local browser preference remembers your theme.
      </p>
      <h2>Before a real production launch</h2>
      <p>
        Formal cancellation policies, dispute resolution, support channels,
        legal terms, and privacy contact details must be established before
        accepting commercial reservations.
      </p>
    </section>
  );
}
