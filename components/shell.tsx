"use client";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster, toast } from "sonner";
import {
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Aperture,
} from "lucide-react";
import { Brand } from "./shared";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
const links = [
  ["Home", "/"],
  ["Explore studios", "/studios"],
  ["How it works", "/how-it-works"],
  ["About us", "/about"],
];
function Header() {
  const path = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { data, isPending } = authClient.useSession();
  const [mobile, setMobile] = useState(false);
  const [account, setAccount] = useState(false);
  async function logout() {
    try {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message);
      await fetch("/api/access", { method: "DELETE" });
      setAccount(false);
      setMobile(false);
      toast.success("You have logged out.");
      router.push("/");
    } catch {
      toast.error("Could not log out. Please retry.");
    }
  }
  return (
    <header className="header">
      <div className="container nav">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              className={
                path === href ||
                (href === "/studios" && path.startsWith("/studios/"))
                  ? "active"
                  : ""
              }
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="icon-btn"
            aria-label="Toggle color theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="light-icon" size={19} />
            <Moon className="dark-icon" size={19} />
          </button>
          {isPending ? (
            <span className="avatar-placeholder" />
          ) : data ? (
            <div className="account">
              <button
                className="avatar-trigger"
                aria-expanded={account}
                onClick={() => setAccount(!account)}
              >
                {data.user.image ? (
                  <Image
                    unoptimized
                    width={1200}
                    height={800}
                    src={data.user.image}
                    alt="Your profile"
                  />
                ) : (
                  <span className="avatar-initial">
                    {data.user.name?.slice(0, 1)}
                  </span>
                )}
                <ChevronDown size={14} />
              </button>
              {account && (
                <>
                  <button
                    className="dropdown-dismiss"
                    aria-label="Close account menu"
                    onClick={() => setAccount(false)}
                  />
                  <div className="dropdown">
                    <strong>{data.user.name}</strong>
                    <small>{data.user.email}</small>
                    {[
                      ["Dashboard", "/dashboard"],
                      ["Add new studio", "/add-studio"],
                      ["My studio listings", "/my-listings"],
                      ["My bookings", "/my-bookings"],
                    ].map(([label, href]) => (
                      <Link
                        href={href}
                        key={href}
                        onClick={() => setAccount(false)}
                      >
                        {label}
                      </Link>
                    ))}
                    <button onClick={logout}>Log out</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="auth-actions">
              <Link href="/login">Log in</Link>
              <Button size="sm" asChild>
                <Link href="/register">
                  Get started <ArrowUpRight size={15} />
                </Link>
              </Button>
            </div>
          )}
          <button
            className="icon-btn mobile-toggle"
            aria-label="Toggle navigation"
            aria-expanded={mobile}
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {mobile && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {[
            ...links,
            ...(data
              ? [
                  ["Dashboard", "/dashboard"],
                  ["Add new studio", "/add-studio"],
                  ["My listings", "/my-listings"],
                  ["My bookings", "/my-bookings"],
                ]
              : [
                  ["Log in", "/login"],
                  ["Register", "/register"],
                ]),
          ].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMobile(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>
              Great spaces. Bigger possibilities.
              <br />
              Connecting creative people with the room to create.
            </p>
            <div className="socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <span className="linkedin-mark">in</span>
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-7.6L5.2 22H2l7.4-8.5L.8 2h6.5l4.5 6.9L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3>Discover</h3>
            <Link href="/studios">Explore studios</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/about">About us</Link>
            <Link href="/add-studio">Host your space</Link>
          </div>
          <div>
            <h3>Find your space</h3>
            {[
              "Photo Studio",
              "Film Stage",
              "Podcast Lounge",
              "Music Suite",
              "Workshop",
            ].map((category) => (
              <Link
                key={category}
                href={`/studios?category=${encodeURIComponent(category)}`}
              >
                {category}
              </Link>
            ))}
          </div>
          <div className="newsletter">
            <h3>A little creative inspiration.</h3>
            <p>Leave your email for future StudioSpace news.</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                toast.info(
                  "Newsletter subscriptions are coming soon. Please check back.",
                );
              }}
            >
              <input
                required
                type="email"
                placeholder="Your email address"
                aria-label="Newsletter email"
              />
              <button aria-label="Newsletter availability">
                <ArrowUpRight size={20} />
              </button>
            </form>
            <small>Newsletter service coming soon.</small>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </span>
          <span>
            Made for the moments you create. <Aperture size={14} />
          </span>
          <Link href="/terms">Terms & privacy</Link>
        </div>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Header />
      <main>{children}</main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}
