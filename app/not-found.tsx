import Link from "next/link";
import { Aperture, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <section className="container not-found">
      <div className="not-found-art">
        <span>4</span>
        <Aperture size={120} strokeWidth={1} />
        <span>4</span>
      </div>
      <p className="eyebrow">A LITTLE OUT OF FRAME</p>
      <h1>This space hasn’t been created yet.</h1>
      <p className="muted">Let’s get you back to somewhere inspiring.</p>
      <Button asChild>
        <Link href="/">
          <ArrowLeft size={17} />
          Return to home
        </Link>
      </Button>
    </section>
  );
}
