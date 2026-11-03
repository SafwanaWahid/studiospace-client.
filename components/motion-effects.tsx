"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Pause, Play } from "lucide-react";

const preferenceKey = "studiospace-motion-paused";
const preferenceEvent = "studiospace:motion-preference";
let temporaryPaused = false;

function getMotionMode() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "reduced";
  try {
    return localStorage.getItem(preferenceKey) === "true" ? "paused" : "full";
  } catch {
    return temporaryPaused ? "paused" : "full";
  }
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  window.addEventListener("storage", callback);
  window.addEventListener(preferenceEvent, callback);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener(preferenceEvent, callback);
  };
}

const serverMode = () => "reduced";
const targets = [
  ".section-heading",
  ".studio-card",
  ".category-card",
  ".step",
  ".creator-visual",
  ".creator-copy",
  ".faq-section > div",
  ".host-cta-copy",
  ".host-cta-art",
  ".footer-top > div",
  ".editor-form > .panel",
  ".listing-row",
  ".booking-row",
  ".stat",
  ".detail-heading",
  ".gallery",
  ".detail-section",
  ".booking-panel",
  ".filters",
  ".category-tabs",
].join(",");

export function MotionEffects() {
  const pathname = usePathname();
  const mode = useSyncExternalStore(subscribe, getMotionMode, serverMode);

  useEffect(() => {
    document.documentElement.dataset.motion = mode;
    window.dispatchEvent(new Event("studiospace:motion"));
    if (mode !== "full" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(targets).forEach((element) => {
        if (element.dataset.reveal !== undefined) {
          if (!element.dataset.revealed) observer.observe(element);
          return;
        }
        const parent = element.parentElement;
        const stagger = parent?.matches(
          ".studio-grid,.category-grid,.steps-grid,.dashboard-grid,.footer-top",
        );
        const index =
          stagger && parent ? Array.from(parent.children).indexOf(element) : 0;
        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(index % 5, 3) * 85}ms`,
        );
        element.dataset.reveal = "";
        observer.observe(element);
      });
    };

    let scanFrame = 0;
    const mutations = new MutationObserver(() => {
      if (scanFrame) return;
      scanFrame = requestAnimationFrame(() => {
        scanFrame = 0;
        scan();
      });
    });
    scan();
    mutations.observe(document.body, { childList: true, subtree: true });

    const revealFocus = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const element = event.target.closest<HTMLElement>("[data-reveal]");
      if (element) {
        element.dataset.revealed = "true";
        observer.unobserve(element);
      }
    };
    document.addEventListener("focusin", revealFocus);

    let progressFrame = 0;
    const updateProgress = () => {
      progressFrame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      document.documentElement.style.setProperty(
        "--page-progress",
        String(progress),
      );
    };
    const scheduleProgress = () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(scanFrame);
      cancelAnimationFrame(progressFrame);
      document.removeEventListener("focusin", revealFocus);
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
    };
  }, [pathname, mode]);

  function toggle() {
    temporaryPaused = mode !== "paused";
    try {
      localStorage.setItem(preferenceKey, String(temporaryPaused));
    } catch {}
    window.dispatchEvent(new Event(preferenceEvent));
  }

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      {mode !== "reduced" && (
        <button
          type="button"
          className="motion-toggle"
          onClick={toggle}
          aria-pressed={mode === "paused"}
        >
          {mode === "paused" ? <Play size={13} /> : <Pause size={13} />}
          {mode === "paused" ? "Resume motion" : "Pause motion"}
        </button>
      )}
    </>
  );
}
