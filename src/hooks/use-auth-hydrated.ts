import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/authStore";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (fn: () => void) => () => void;
};

function getAuthPersist(): PersistApi | undefined {
  return (useAuthStore as unknown as { persist?: PersistApi }).persist;
}

function readHydratedFromPersist(): boolean {
  if (typeof window === "undefined") return false;
  const persist = getAuthPersist();
  if (!persist) return true;
  return persist.hasHydrated();
}

/** True after zustand persist has rehydrated user from sessionStorage (client only) */
export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(readHydratedFromPersist);

  useEffect(() => {
    const persist = getAuthPersist();
    if (!persist || persist.hasHydrated()) return;
    return persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
