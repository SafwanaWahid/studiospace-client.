import { BookingSteps } from "@/components/home";
import { Heading } from "@/components/shared";
export const metadata = { title: "How it works" };
export default function Page() {
  return (
    <>
      <div className="container section page-intro">
        <Heading
          eyebrow="MORE CREATING. LESS COMPLICATING."
          title="Your next session, simplified."
          description="Explore the collection, select your hours, and request a reservation. Your host confirms the time, and you bring the ideas."
        />
      </div>
      <BookingSteps />
      <section className="container section prose panel">
        <h2>Good to know before you book</h2>
        <p>
          Reservations start as Pending. Hosts approve requests from their
          Dashboard. Confirmed hours are checked for overlaps so the same studio
          cannot be confirmed for two sessions at once.
        </p>
        <p>
          Pending requests can be cancelled from My Bookings. Hourly charges and
          security deposits appear before you submit. This assignment demo does
          not process payments.
        </p>
        <h2>Hosting a creative space</h2>
        <p>
          Create an account, add photos and an accurate description, and publish
          your listing. You can update your space from My Studio Listings and
          manage incoming reservations in Dashboard.
        </p>
      </section>
    </>
  );
}
