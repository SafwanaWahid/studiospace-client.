"use client";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Users,
  Check,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, errorMessage } from "@/lib/api";
import { money, type Studio } from "@/lib/types";
import { useResource, Skeleton, ErrorState, Modal } from "./shared";
import { Button } from "./ui/button";
export default function Details({ id }: { id: string }) {
  const {
    data: studio,
    loading,
    error,
    reload,
  } = useResource<Studio>(`/studios/${id}`);
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [image, setImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const hours =
    start && end ? (+new Date(end) - +new Date(start)) / 3600000 : 0;
  const validHours = Number.isFinite(hours) && hours > 0 && hours <= 24;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validHours || +new Date(start) <= Date.now()) {
      toast.error(
        "Choose future hours, with the end after the start. Maximum 24 hours.",
      );
      return;
    }
    setBusy(true);
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: id,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
        }),
      });
      toast.success("Request sent! Your booking is pending host confirmation.");
      setOpen(false);
      router.push("/my-bookings");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <div className="container section">
        <Skeleton />
      </div>
    );
  if (error || !studio)
    return (
      <section className="container section">
        <ErrorState message={error || "Studio not found."} retry={reload} />
        <Link className="text-link" href="/studios">
          Back to studios
        </Link>
      </section>
    );
  function book() {
    if (!session)
      router.push(`/login?next=${encodeURIComponent(`/studios/${id}`)}`);
    else setOpen(true);
  }
  return (
    <section className="container section">
      <Link href="/studios" className="text-link back">
        <ArrowLeft size={16} />
        All studios
      </Link>
      <div className="detail-heading">
        <div>
          <span className="pill">{studio.category}</span>
          <h1>{studio.title}</h1>
          <p>
            <MapPin size={16} />
            {studio.location}
            <span>·</span>
            <Star size={15} className="accent" />
            {studio.reviewCount
              ? `${studio.rating.toFixed(1)} (${studio.reviewCount} reviews)`
              : "New studio"}
          </p>
        </div>
        <span className="detail-capacity">
          <Users size={18} />
          Up to {studio.capacity} people
        </span>
      </div>
      <div className="gallery">
        <Image
          unoptimized
          width={1200}
          height={800}
          src={studio.images[image] || studio.images[0]}
          alt={`${studio.title}, view ${image + 1}`}
        />
        {studio.images.length > 1 && (
          <>
            <button
              className="gallery-prev icon-btn"
              aria-label="Previous image"
              onClick={() =>
                setImage(
                  (image + studio.images.length - 1) % studio.images.length,
                )
              }
            >
              <ArrowLeft />
            </button>
            <button
              className="gallery-next icon-btn"
              aria-label="Next image"
              onClick={() => setImage((image + 1) % studio.images.length)}
            >
              <ArrowRight />
            </button>
          </>
        )}
        <span className="gallery-count">
          {image + 1} / {studio.images.length}
        </span>
      </div>
      {studio.images.length > 1 && (
        <div className="thumbnails">
          {studio.images.map((url, index) => (
            <button
              key={index}
              className={image === index ? "chosen" : ""}
              onClick={() => setImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                unoptimized
                width={1200}
                height={800}
                src={url}
                alt={`Thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
      <div className="detail-layout">
        <div>
          <div className="detail-section host-line">
            {studio.ownerImage ? (
              <Image
                unoptimized
                width={1200}
                height={800}
                src={studio.ownerImage}
                alt={studio.ownerName}
              />
            ) : (
              <span className="avatar-initial">
                {studio.ownerName.charAt(0)}
              </span>
            )}
            <div>
              <h3>Hosted by {studio.ownerName}</h3>
              <p className="muted">{studio.ownerEmail}</p>
            </div>
          </div>
          <div className="detail-section">
            <h2>About this space</h2>
            <p className="overview">{studio.overview}</p>
          </div>
          <div className="detail-section">
            <h2>Everything you need to create</h2>
            <div className="amenities">
              {studio.amenities.length ? (
                studio.amenities.map((item) => (
                  <span key={item}>
                    <Check size={18} />
                    {item}
                  </span>
                ))
              ) : (
                <p className="muted">
                  Contact your host for equipment details.
                </p>
              )}
            </div>
          </div>
          <div className="detail-section">
            <h2>Confirmed sessions</h2>
            <p className="muted">
              Times below are unavailable. All times display in your local time
              zone.
            </p>
            {studio.availability?.length ? (
              <ul className="availability">
                {studio.availability.map((slot, index) => (
                  <li key={index}>
                    <CalendarDays size={17} />
                    {new Date(slot.start).toLocaleString()} —{" "}
                    {new Date(slot.end).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="availability-empty">
                No confirmed sessions yet. Choose your preferred hours.
              </p>
            )}
          </div>
          <div className="detail-section">
            <h2>Creator reviews</h2>
            {studio.reviews?.length ? (
              studio.reviews.map((review) => (
                <article className="review" key={review._id}>
                  <strong>{review.userName}</strong>
                  <span>
                    <Star size={14} /> {review.rating}
                  </span>
                  <p>{review.comment}</p>
                </article>
              ))
            ) : (
              <p className="muted">
                No reviews yet. This space is ready for its first creative
                stories.
              </p>
            )}
          </div>
        </div>
        <aside className="booking-panel panel">
          <p>
            <strong>{money(studio.hourlyRate)}</strong>
            <span className="muted"> / hour</span>
          </p>
          <div className="price-row">
            <span>Security deposit</span>
            <strong>{money(studio.deposit)}</strong>
          </div>
          <div className="price-row">
            <span>Capacity</span>
            <strong>{studio.capacity} people</strong>
          </div>
          <Button
            onClick={book}
            disabled={session?.user.email === studio.ownerEmail}
          >
            {session?.user.email === studio.ownerEmail
              ? "This is your studio"
              : "Book workspace now"}
            <ArrowRight size={17} />
          </Button>
          <small>
            No payment is collected on this demo. Your host confirms each
            request.
          </small>
          <div className="booking-assurance">
            <ShieldCheck size={20} />
            <p>
              Transparent rates.
              <br />
              Space to focus on your next idea.
            </p>
          </div>
        </aside>
      </div>
      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title="Make room for your next idea"
      >
        <p className="muted">
          {studio.title} · {money(studio.hourlyRate)} / hour
        </p>
        <form className="form-stack" onSubmit={submit}>
          <label>
            Start — your local time
            <input
              type="datetime-local"
              required
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label>
            End — your local time
            <input
              type="datetime-local"
              required
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
          <div className="booking-summary">
            <div>
              <span>Studio time</span>
              <strong>
                {validHours
                  ? `${hours.toFixed(2)} hours · ${money(hours * studio.hourlyRate)}`
                  : "Select your hours"}
              </strong>
            </div>
            <div>
              <span>Refundable security deposit</span>
              <strong>{money(studio.deposit)}</strong>
            </div>
            <div>
              <span>Total reservation estimate</span>
              <strong>
                {money(
                  (validHours ? hours * studio.hourlyRate : 0) + studio.deposit,
                )}
              </strong>
            </div>
          </div>
          <p className="muted small">
            Your request starts as Pending. A host confirms availability.
            Security deposits and any payments are handled with the host.
          </p>
          <Button disabled={busy || !validHours} type="submit">
            {busy ? "Sending request…" : "Request booking"}
          </Button>
        </form>
      </Modal>
    </section>
  );
}
