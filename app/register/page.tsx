import { Suspense } from "react";
import AuthPage from "@/components/auth-page";
export const metadata = { title: "Create an account" };
export default function Page() {
  return (
    <Suspense fallback={<p className="container section">Loading…</p>}>
      <AuthPage register />
    </Suspense>
  );
}
