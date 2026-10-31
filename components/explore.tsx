"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, type FormEvent } from "react";
import { categories, type Studio } from "@/lib/types";
import {
  useResource,
  Heading,
  Skeleton,
  StudioCard,
  Empty,
  ErrorState,
} from "./shared";
import { Button } from "./ui/button";
export default function Explore() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") || "";
  const sort = params.get("sort") || "newest";
  const search = params.get("search") || "";
  const [draft, setDraft] = useState(search);
  const { data, loading, error, reload } = useResource<Studio[]>(
    `/studios?${params.toString()}`,
  );
  function update(key: string, value: string) {
    const query = new URLSearchParams(params.toString());
    if (value) query.set(key, value);
    else query.delete(key);
    router.push(`/studios?${query}`);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update("search", draft);
  }
  return (
    <section className="container section">
      <Heading
        eyebrow="FIND YOUR NEXT CREATIVE HOME"
        title="A space for every possibility."
        description="Big productions. Quiet conversations. Beautiful first takes. Find your fit."
      />
      <div className="filters">
        <form onSubmit={submit} className="search-input">
          <Search size={18} />
          <input
            aria-label="Search studios or locations"
            placeholder="Search studios or locations…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button size="sm" type="submit">
            Search
          </Button>
        </form>
        <label className="sort">
          <SlidersHorizontal size={16} />
          <select
            aria-label="Sort studios"
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="category-tabs">
        {["", ...categories].map((item) => (
          <button
            className={item === category ? "selected" : ""}
            key={item}
            onClick={() => update("category", item)}
          >
            {item || "All spaces"}
          </button>
        ))}
      </div>
      <div className="results-label">
        <span>
          {loading
            ? "Finding your space…"
            : `${data?.length || 0} creative spaces`}
        </span>
        <span>Make something extraordinary.</span>
      </div>
      {loading ? (
        <Skeleton cards={6} />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : !data?.length ? (
        <Empty
          title="No studios found"
          description="Try another category, studio name, or location."
          href="/studios"
          action="Clear filters"
        />
      ) : (
        <div className="studio-grid">
          {data.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </section>
  );
}
