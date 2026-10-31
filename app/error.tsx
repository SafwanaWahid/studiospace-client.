"use client";
import { ErrorState } from "@/components/shared";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <section className="container section">
      <ErrorState message="Please try again in a moment." retry={reset} />
    </section>
  );
}
