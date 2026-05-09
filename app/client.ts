import { createClient } from "honox/client";
import { initNavigation } from "../src/lib/client/navigate";

type HydrateFn = (doc: {
  querySelectorAll: typeof document.querySelectorAll;
}) => Promise<void>;

let rehydrate: HydrateFn = async () => {};

createClient({
  triggerHydration: async (hydrateComponent) => {
    rehydrate = hydrateComponent;
    await hydrateComponent(document);
  },
});

initNavigation({
  onAfterSwap: () => rehydrate(document),
});
