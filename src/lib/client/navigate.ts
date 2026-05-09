const FRAME_ATTR = "data-honox-frame";

type NavigateOptions = {
  onAfterSwap?: () => void | Promise<void>;
};

let afterSwap: NavigateOptions["onAfterSwap"];

export function initNavigation(opts: NavigateOptions = {}) {
  if (typeof window === "undefined") return;
  afterSwap = opts.onAfterSwap;

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    const link = (e.target as Element | null)?.closest?.("a");
    if (!link) return;
    if (!shouldIntercept(e, link)) return;

    e.preventDefault();
    void visit(link.href);
  });

  window.addEventListener("popstate", () => {
    void visit(location.href, { updateHistory: false });
  });
}

function shouldIntercept(e: MouseEvent, link: HTMLAnchorElement): boolean {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (e.button !== 0) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;
  if (link.origin !== location.origin) return false;
  if (link.pathname === location.pathname && link.hash) return false;
  if (link.hasAttribute("data-no-frame")) return false;
  return true;
}

async function visit(
  url: string,
  opts: { updateHistory?: boolean } = {},
): Promise<void> {
  const updateHistory = opts.updateHistory ?? true;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "X-Honox-Frame": "true" },
      credentials: "same-origin",
    });
  } catch {
    fullReload(url);
    return;
  }

  if (!response.ok) {
    fullReload(url);
    return;
  }

  const html = await response.text();
  const newDoc = new DOMParser().parseFromString(html, "text/html");

  const newFrames = newDoc.querySelectorAll(`[${FRAME_ATTR}]`);
  if (newFrames.length === 0) {
    fullReload(url);
    return;
  }

  let swapped = false;
  newFrames.forEach((newFrame) => {
    const id = newFrame.getAttribute(FRAME_ATTR);
    if (!id) return;
    const currentFrame = document.querySelector(`[${FRAME_ATTR}="${id}"]`);
    if (!currentFrame) return;
    currentFrame.innerHTML = newFrame.innerHTML;
    swapped = true;
  });

  if (!swapped) {
    fullReload(url);
    return;
  }

  if (newDoc.title) document.title = newDoc.title;

  if (updateHistory) {
    history.pushState({}, "", url);
    window.scrollTo(0, 0);
  }

  if (afterSwap) {
    try {
      await afterSwap();
    } catch (err) {
      console.error("[honox-frame] afterSwap failed:", err);
    }
  }
}

function fullReload(url: string): void {
  window.location.href = url;
}
