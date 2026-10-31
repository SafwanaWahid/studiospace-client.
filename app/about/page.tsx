import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/shared";
import { Button } from "@/components/ui/button";
export const metadata = { title: "About us" };
export default function Page() {
  return (
    <section className="container section">
      <Heading
        eyebrow="BUILT AROUND CREATIVE POSSIBILITY"
        title="Great work starts with the right space."
        description="StudioSpace connects people with ideas to people with room to bring them to life."
      />
      <Image
        unoptimized
        width={1200}
        height={800}
        className="about-image"
        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=85"
        alt="A welcoming shared creative workspace"
      />
      <div className="prose section">
        <h2>More room for what matters.</h2>
        <p>
          Finding a location can take energy away from the work itself. We bring
          photography studios, film stages, podcast lounges, music suites, and
          workshops into one place, with clear rates and straightforward booking
          requests.
        </p>
        <p>
          For hosts, StudioSpace makes free studio hours discoverable. For
          creators, it opens the door to a setting that fits the project, the
          people, and the budget.
        </p>
        <h2>Small details. Better sessions.</h2>
        <p>
          Accurate descriptions, useful amenities, clear deposits, and
          thoughtful communication make creative collaboration easier. That’s
          the kind of community we want to help build.
        </p>
        <Button asChild>
          <Link href="/studios">Find your next space</Link>
        </Button>
      </div>
    </section>
  );
}
