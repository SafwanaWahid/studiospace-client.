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
export function MotionEffects() {
  const pathname = usePathname();
  const mode = useSyncExternalStore(subscribe, getMotionMode, serverMode);

  useEffect(() => {
    document.documentElement.dataset.motion = mode;
    window.dispatchEvent(new Event("studiospace:motion"));
    if (mode !== "full") return;

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
      cancelAnimationFrame(progressFrame);
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
