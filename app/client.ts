import { createElement } from "hono/jsx";
import { render } from "hono/jsx/dom";
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

const PAGES = import.meta.glob<{ default: unknown }>("/app/pages/*.tsx");

initNavigation({
  loadPage: async (name) => {
    const path = `/app/pages/${name}.tsx`;
    const loader = PAGES[path];
    if (!loader) return null;
    const mod = await loader();
    return mod.default;
  },
  renderPage: (Component, props, frame) => {
    render(
      createElement(Component as (props: unknown) => unknown, props),
      frame as HTMLElement,
    );
  },
  onAfterSwap: () => rehydrate(document),
});
