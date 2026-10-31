import { Suspense } from "react";
import AuthPage from "@/components/auth-page";
export const metadata = { title: "Log in" };
export default function Page() {
  return (
    <Suspense fallback={<p className="container section">Loading…</p>}>
      <AuthPage />
    </Suspense>
  );
}
