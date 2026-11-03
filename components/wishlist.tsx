"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type WishlistContextValue = {
  ids: string[];
  loading: boolean;
  signedIn: boolean;
  toggle: (studioId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user.id;
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (isPending) return;
    if (!userId) {
      setIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api<string[]>("/wishlist/ids")
      .then((nextIds) => {
        if (active) setIds(nextIds);
      })
      .catch(() => {
        if (active) setIds([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId, isPending]);

  const toggle = useCallback(
    async (studioId: string) => {
      const saved = ids.includes(studioId);
      if (saved) {
        await api(`/wishlist/${studioId}`, { method: "DELETE" });
        setIds((current) => current.filter((id) => id !== studioId));
        toast.success("Removed from saved studios.");
      } else {
        await api(`/wishlist/${studioId}`, { method: "POST" });
        setIds((current) =>
          current.includes(studioId) ? current : [...current, studioId],
        );
        toast.success("Studio saved to your wishlist.");
      }
    },
    [ids],
  );

  const value = useMemo(
    () => ({
      ids,
      loading: isPending || loading,
      signedIn: Boolean(userId),
      toggle,
    }),
    [ids, isPending, loading, userId, toggle],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value)
    throw new Error("useWishlist must be used inside WishlistProvider.");
  return value;
}

export function showWishlistError(error: unknown) {
  toast.error(errorMessage(error));
}
