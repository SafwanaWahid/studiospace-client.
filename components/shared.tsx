"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Aperture,
  ArrowUpRight,
  MapPin,
  Star,
  X,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api, errorMessage } from "@/lib/api";
import { type Studio, money } from "@/lib/types";
import { Button } from "./ui/button";
export function Brand() {
  return (
    <Link href="/" className="brand">
      <Aperture size={29} strokeWidth={1.7} />
      <span>
        studio<span className="brand-light">space</span>
        <span className="accent">.</span>
      </span>
    </Link>
  );
}
export function Skeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="studio-grid" aria-label="Loading studios" role="status">
      {Array.from({ length: cards }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  );
}
export function Empty({
  title = "Your next creative space is waiting",
  description = "Explore studios and find a space that fits your next project.",
  href = "/studios",
  action = "Explore studios",
}: {
  title?: string;
  description?: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="empty">
      <Aperture size={45} />
      <h2>{title}</h2>
      <p>{description}</p>
      <Button asChild>
        <Link href={href}>
          {action}
          <ArrowRight size={16} />
        </Link>
      </Button>
    </div>
  );
}
export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div role="alert" className="error-state">
      <h2>We couldn’t load this just yet.</h2>
      <p>{message}</p>
      {retry && <Button onClick={retry}>Try again</Button>}
    </div>
  );
}
export function Heading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="studio-card">
      <Link href={`/studios/${studio._id}`} className="card-image">
        <Image
          unoptimized
          width={1200}
          height={800}
          src={studio.images[0]}
          alt={studio.title}
          loading="lazy"
        />
        <span className="category-badge">{studio.category}</span>
        <span className="card-open">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="card-content">
        <div className="card-top">
          <p>
            <MapPin size={13} />
            {studio.location}
          </p>
          <span className="rating">
            <Star size={13} fill="currentColor" />
            {studio.reviewCount ? studio.rating.toFixed(1) : "New"}
          </span>
        </div>
        <h3>
          <Link href={`/studios/${studio._id}`}>{studio.title}</Link>
        </h3>
        <div className="card-bottom">
          <p>
            <strong>{money(studio.hourlyRate)}</strong>
            <span> / hour</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="text-link">
            View details <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <div className="modal-heading">
          <h2>{title}</h2>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function Private({ children }: { children: ReactNode }) {
  const { data, isPending, error, refetch } = authClient.useSession();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (!isPending && !error && !data)
      router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [data, isPending, error, path, router]);
  if (error)
    return (
      <ErrorState
        message="Couldn’t check your session. Make sure the API server is running."
        retry={() => void refetch()}
      />
    );
  if (isPending || !data)
    return (
      <section className="container section">
        <Skeleton />
      </section>
    );
  return children;
}
export function useResource<T>(path: string) {
  const [state, setState] = useState<{
    data?: T;
    error?: string;
    loading: boolean;
    path?: string;
  }>({ loading: true });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    api<T>(path)
      .then((data) => {
        if (active) setState({ data, loading: false, path });
      })
      .catch((error) => {
        if (active)
          setState({ error: errorMessage(error), loading: false, path });
      });
    return () => {
      active = false;
    };
  }, [path, version]);
  return {
    ...state,
    loading: state.loading || state.path !== path,
    reload: () => setVersion((value) => value + 1),
  };
}
