"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  ArrowUpRight,
  Building2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { type Studio, type Booking, money } from "@/lib/types";
import {
  Private,
  useResource,
  Heading,
  Skeleton,
  ErrorState,
  Empty,
  Modal,
} from "./shared";
import { Button } from "./ui/button";
function Listings() {
  const { data, loading, error, reload } =
    useResource<Studio[]>("/my-listings");
  const [selected, setSelected] = useState<Studio>();
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!selected) return;
    setBusy(true);
    try {
      await api(`/studios/${selected._id}`, { method: "DELETE" });
      toast.success("Studio deleted.");
      setSelected(undefined);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="container section">
      <Heading
        eyebrow="YOUR HOSTING JOURNEY"
        title="My studio listings"
        description="A little space can open up a lot of possibilities."
      >
        <Button asChild>
          <Link href="/add-studio">
            <Plus size={17} />
            Add new studio
          </Link>
        </Button>
      </Heading>
      {loading ? (
        <Skeleton />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : !data?.length ? (
        <Empty
          title="Open your doors to creators"
          description="Your first listing could be someone’s favorite place to create."
          href="/add-studio"
          action="Add your first studio"
        />
      ) : (
        <div className="listing-list">
          {data.map((studio) => (
            <article className="listing-row panel" key={studio._id}>
              <Image
                unoptimized
                width={1200}
                height={800}
                src={studio.images[0]}
                alt={studio.title}
              />
              <div className="listing-info">
                <span className="eyebrow">{studio.category}</span>
                <h3>
                  <Link href={`/studios/${studio._id}`}>{studio.title}</Link>
                </h3>
                <p className="muted">{studio.location}</p>
                <strong>{money(studio.hourlyRate)} / hour</strong>
              </div>
              <div className="row-actions">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/studios/edit/${studio._id}`}>
                    <Pencil size={15} />
                    Update
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setSelected(studio)}
                >
                  <Trash2 size={15} />
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Modal
        open={Boolean(selected)}
        onClose={() => !busy && setSelected(undefined)}
        title="Delete this studio?"
      >
        <p className="muted">
          “{selected?.title}” will be removed from Explore. Pending requests
          will be cancelled. Upcoming confirmed bookings must be completed
          first.
        </p>
        <div className="form-actions">
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => setSelected(undefined)}
          >
            Keep studio
          </Button>
          <Button variant="destructive" disabled={busy} onClick={remove}>
            {busy ? "Deleting…" : "Delete studio"}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
function BookingList({ host = false }: { host?: boolean }) {
  const { data, loading, error, reload } = useResource<Booking[]>(
    host ? "/bookings?host=true" : "/bookings",
  );
  const [action, setAction] = useState<{ id: string; status: string }>();
  const [busy, setBusy] = useState(false);
  async function update() {
    if (!action) return;
    setBusy(true);
    try {
      await api(`/bookings/${action.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: action.status }),
      });
      toast.success(`Booking ${action.status.toLowerCase()}.`);
      setAction(undefined);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>
            {host ? "Incoming studio reservations" : "Your creative calendar"}
          </h2>
          <p className="muted">
            {host
              ? "Confirm requests, avoid overlaps, and welcome your next creator."
              : "Every great session starts with a little planning."}
          </p>
        </div>
        <Link className="text-link" href="/studios">
          Explore studios <ArrowUpRight size={16} />
        </Link>
      </div>
      {loading ? (
        <Skeleton />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : !data?.length ? (
        <Empty
          title={
            host
              ? "Your next creator is on the way"
              : "Your calendar has room for something great"
          }
          description={
            host
              ? "Booking requests for your studios will appear here."
              : "Find a studio and reserve time for your next idea."
          }
        />
      ) : (
        <div className="booking-list">
          {data.map((booking) => (
            <article className="booking-row panel" key={booking._id}>
              <Image
                unoptimized
                width={1200}
                height={800}
                src={booking.studioImage}
                alt={booking.studioTitle}
              />
              <div className="booking-info">
                <span
                  className={`status status-${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>
                <h3>
                  <Link href={`/studios/${booking.studioId}`}>
                    {booking.studioTitle}
                  </Link>
                </h3>
                {host && <p className="muted">Creator: {booking.userName}</p>}
                <p>
                  <CalendarDays size={15} />
                  {new Date(booking.start).toLocaleString()}
                  <br />
                  to {new Date(booking.end).toLocaleString()}
                </p>
                <p className="muted">
                  {booking.hours.toFixed(2)} hours · Deposit included
                </p>
              </div>
              <div className="booking-actions">
                <strong>{money(booking.total)}</strong>
                {booking.status === "Pending" && (
                  <>
                    {host && (
                      <Button
                        size="sm"
                        onClick={() =>
                          setAction({ id: booking._id, status: "Confirmed" })
                        }
                      >
                        <Check size={15} />
                        Confirm
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setAction({ id: booking._id, status: "Cancelled" })
                      }
                    >
                      <X size={15} />
                      {host ? "Decline" : "Cancel booking"}
                    </Button>
                  </>
                )}
                {host &&
                  booking.status === "Confirmed" &&
                  booking.canComplete && (
                    <Button
                      size="sm"
                      onClick={() =>
                        setAction({ id: booking._id, status: "Completed" })
                      }
                    >
                      Mark completed
                    </Button>
                  )}
              </div>
            </article>
          ))}
        </div>
      )}
      <Modal
        open={Boolean(action)}
        onClose={() => !busy && setAction(undefined)}
        title={
          action?.status === "Cancelled"
            ? "Cancel this reservation?"
            : action?.status === "Confirmed"
              ? "Confirm these studio hours?"
              : "Mark this session completed?"
        }
      >
        <p className="muted">
          {action?.status === "Confirmed"
            ? "We’ll check for overlapping confirmed reservations before approving these hours."
            : "This will update the reservation status for both the creator and the host."}
        </p>
        <div className="form-actions">
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => setAction(undefined)}
          >
            Go back
          </Button>
          <Button disabled={busy} onClick={update}>
            {busy ? "Updating…" : "Confirm change"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
function Dashboard() {
  const { data } = authClient.useSession();
  const listings = useResource<Studio[]>("/my-listings");
  const bookings = useResource<Booking[]>("/bookings");
  return (
    <section className="container section">
      <Heading
        eyebrow="YOUR CREATIVE CONTROL ROOM"
        title={`Welcome, ${data?.user.name?.split(" ")[0] || "creator"}.`}
        description="Manage your spaces, your sessions, and what comes next."
      />
      <div className="dashboard-grid">
        <Link className="panel stat" href="/my-listings">
          <Building2 />
          <span>Your studios</span>
          <strong>
            {listings.loading
              ? "…"
              : listings.error
                ? "—"
                : listings.data?.length || 0}
          </strong>
        </Link>
        <Link className="panel stat" href="/my-bookings">
          <CalendarDays />
          <span>Your bookings</span>
          <strong>
            {bookings.loading
              ? "…"
              : bookings.error
                ? "—"
                : bookings.data?.length || 0}
          </strong>
        </Link>
        <Link className="panel stat stat-cta" href="/add-studio">
          <Plus />
          <span>Give your space a new purpose</span>
          <strong>
            List a studio <ArrowUpRight />
          </strong>
        </Link>
      </div>
      <BookingList host />
    </section>
  );
}
export default function AccountPage({
  page,
}: {
  page: "listings" | "bookings" | "dashboard";
}) {
  return (
    <Private>
      {page === "listings" ? (
        <Listings />
      ) : page === "dashboard" ? (
        <Dashboard />
      ) : (
        <section className="container section">
          <Heading eyebrow="SAVE TIME FOR WHAT YOU LOVE" title="My bookings" />
          <BookingList />
        </section>
      )}
    </Private>
  );
}
