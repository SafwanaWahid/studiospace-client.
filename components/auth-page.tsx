"use client";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowUpRight, Aperture } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { errorMessage } from "@/lib/api";
import { Button } from "./ui/button";
import { useResource } from "./shared";
export default function AuthPage({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const target = params.get("next");
  const next =
    target?.startsWith("/") &&
    !target.startsWith("//") &&
    !target.includes("\\")
      ? target
      : "/";
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { data: config } = useResource<{ googleEnabled: boolean }>("/config");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    if (
      register &&
      (!/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        password.length < 6)
    ) {
      setError(
        "Use at least 6 characters, including uppercase and lowercase letters.",
      );
      return;
    }
    setError("");
    setBusy(true);
    try {
      const result = register
        ? await authClient.signUp.email({
            name: String(form.get("name")).trim(),
            email,
            password,
            image: String(form.get("image")).trim() || undefined,
          })
        : await authClient.signIn.email({ email, password });
      if (result.error)
        throw new Error(result.error.message || "Authentication failed.");
      toast.success(
        register ? "Account created. Please log in." : "Welcome back!",
      );
      router.push(register ? "/login" : next);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    if (!config?.googleEnabled) {
      toast.info(
        "Google login needs Google credentials configured on the server.",
      );
      return;
    }
    setBusy(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: register ? "/" : next,
      });
      if (result.error) throw new Error(result.error.message);
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  }
  return (
    <section className="container auth-layout">
      <div className="auth-photo">
        <Image
          unoptimized
          width={1200}
          height={800}
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=85"
          alt="Sunlit creative workspace"
        />
        <div>
          <Aperture size={38} />
          <h2>
            A space for your
            <br />
            next chapter.
          </h2>
          <p>Find your people. Find your place. Make something that matters.</p>
        </div>
      </div>
      <div className="auth-panel">
        <p className="eyebrow">YOUR CREATIVE COMMUNITY</p>
        <h1>{register ? "Make room for more." : "Welcome back."}</h1>
        <p className="muted">
          {register
            ? "A new space. A new connection. It starts here."
            : "Your next creative session is just around the corner."}
        </p>
        <Button
          variant="outline"
          className="google-btn"
          onClick={google}
          disabled={busy}
        >
          <span className="google-g">G</span>Continue with Google
        </Button>
        <div className="divider">
          <span>or continue with email</span>
        </div>
        <form onSubmit={submit} className="form-stack">
          {register && (
            <label>
              Full name
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Your full name"
              />
            </label>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>
          {register && (
            <label>
              Photo URL
              <input
                name="image"
                type="url"
                placeholder="https://example.com/your-photo.jpg"
              />
            </label>
          )}
          <label>
            Password
            <div className="password-wrap">
              <input
                name="password"
                type={show ? "text" : "password"}
                autoComplete={register ? "new-password" : "current-password"}
                required
                minLength={6}
                maxLength={128}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {register && (
              <small>6+ characters with uppercase and lowercase letters.</small>
            )}
          </label>
          {!register && (
            <button
              type="button"
              className="forgot"
              onClick={() =>
                toast.info(
                  "Password recovery is disabled for this assignment, as required.",
                )
              }
            >
              Forgot password?
            </button>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <Button disabled={busy} type="submit">
            {busy
              ? "Please wait…"
              : register
                ? "Create your account"
                : "Log in"}
            <ArrowUpRight size={18} />
          </Button>
        </form>
        <p className="auth-switch">
          {register ? "Already part of the community?" : "New around here?"}{" "}
          <Link href={register ? "/login" : "/register"}>
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}
