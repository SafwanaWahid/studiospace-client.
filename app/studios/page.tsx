import { Suspense } from "react";
import Explore from "@/components/explore";
export const metadata = { title: "Explore studios" };
export default function Page() {
  return (
    <Suspense
      fallback={<p className="container section">Finding your space…</p>}
    >
      <Explore />
    </Suspense>
  );
}
