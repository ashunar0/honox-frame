import { createElement } from "hono/jsx";
import { render } from "hono/jsx/dom";
import { createClient } from "honox/client";
import {
  HonoxFrameApp,
  loadPageComponent,
  setPage,
  setPageLoader,
  type PageData,
} from "../src/lib/client/app";
import {
  FRAME_ATTR,
  MAIN_FRAME,
  initNavigation,
} from "../src/lib/client/navigate";

const PAGE_META_ID = "__honox_page__";

type HydrateFn = (doc: {
  querySelectorAll: typeof document.querySelectorAll;
}) => Promise<void>;

let hydrateRef: HydrateFn | null = null;
let bootstrapped = false;

createClient({
  triggerHydration: async (hydrateComponent) => {
    hydrateRef = hydrateComponent;
    if (bootstrapped) {
      await hydrateComponent(document);
    }
  },
});

const PAGES = import.meta.glob<{ default: unknown }>(
  "/app/features/**/*.tsx",
);

const PAGES_BY_NAME: Record<string, () => Promise<{ default: unknown }>> = {};
for (const [path, loader] of Object.entries(PAGES)) {
  const filename = path.split("/").pop();
  if (!filename) continue;
  const name = filename.replace(/\.tsx$/, "");
  PAGES_BY_NAME[name] = loader;
}

setPageLoader(async (name) => {
  const loader = PAGES_BY_NAME[name];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
});

void bootstrap();

async function bootstrap(): Promise<void> {
  const initialPage = readPageMeta();
  const frame = document.querySelector(`[${FRAME_ATTR}="${MAIN_FRAME}"]`);

  if (initialPage && frame) {
    const Component = await loadPageComponent(initialPage.component);
    if (Component) {
      render(
        createElement(HonoxFrameApp, {
          initial: { page: initialPage, Component },
        }),
        frame as HTMLElement,
      );
    }
  }

  bootstrapped = true;
  if (hydrateRef) await hydrateRef(document);

  initNavigation({
    onPageData: (data) => setPage(data),
    onAfterSwap: () => {
      if (hydrateRef) return hydrateRef(document);
    },
  });
}

function readPageMeta(): PageData | null {
  const el = document.getElementById(PAGE_META_ID);
  if (!el || !el.textContent) return null;
  try {
    return JSON.parse(el.textContent) as PageData;
  } catch (err) {
    console.error("[honox-frame] failed to parse page meta:", err);
    return null;
  }
}
