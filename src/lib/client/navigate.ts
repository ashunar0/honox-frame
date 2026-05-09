const FRAME_ATTR = "data-honox-frame";
const MAIN_FRAME = "main";

type PageData = {
  component: string;
  props: Record<string, unknown>;
  url?: string;
  title?: string;
  partial?: string[];
};

type NavigateOptions = {
  onAfterSwap?: () => void | Promise<void>;
  onPageData?: (data: PageData) => void | Promise<void>;
};

let afterSwap: NavigateOptions["onAfterSwap"];
let onPageData: NavigateOptions["onPageData"];

export function initNavigation(opts: NavigateOptions = {}) {
  if (typeof window === "undefined") return;
  afterSwap = opts.onAfterSwap;
  onPageData = opts.onPageData;

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    const link = (e.target as Element | null)?.closest?.("a");
    if (!link) return;
    if (!shouldInterceptLink(e, link)) return;
    e.preventDefault();
    const only = parseOnly(link.getAttribute("data-honox-only"));
    void visitLink(link.href, { only });
  });

  document.addEventListener("submit", (e) => {
    if (e.defaultPrevented) return;
    const form = e.target as HTMLFormElement;
    if (!shouldInterceptForm(form)) return;
    e.preventDefault();
    void submitForm(form, e as SubmitEvent);
  });

  window.addEventListener("popstate", () => {
    void visitLink(location.href, { updateHistory: false });
  });
}

function shouldInterceptLink(e: MouseEvent, link: HTMLAnchorElement): boolean {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (e.button !== 0) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;
  if (link.origin !== location.origin) return false;
  if (link.pathname === location.pathname && link.hash) return false;
  if (link.hasAttribute("data-no-frame")) return false;
  return true;
}

function shouldInterceptForm(form: HTMLFormElement): boolean {
  if (form.target && form.target !== "_self") return false;
  if (form.hasAttribute("data-no-frame")) return false;
  try {
    const url = new URL(form.action, location.href);
    if (url.origin !== location.origin) return false;
  } catch {
    return false;
  }
  return true;
}

async function visitLink(
  url: string,
  opts: { updateHistory?: boolean; only?: string[] } = {},
): Promise<void> {
  const updateHistory = opts.updateHistory ?? true;
  const headers: Record<string, string> = { "X-Honox-Mode": "json" };
  if (opts.only && opts.only.length > 0) {
    headers["X-Honox-Partial-Data"] = opts.only.join(",");
  }
  let response: Response;
  try {
    response = await fetch(url, {
      headers,
      credentials: "same-origin",
    });
  } catch {
    fullReload(url);
    return;
  }
  await handleResponse(response, response.url || url, { updateHistory });
}

async function submitForm(
  form: HTMLFormElement,
  e: SubmitEvent,
): Promise<void> {
  const submitter = e.submitter as
    | HTMLButtonElement
    | HTMLInputElement
    | null;
  const action = submitter?.formAction || form.action || location.href;
  const method = (submitter?.formMethod || form.method || "GET").toUpperCase();
  const enctype =
    submitter?.formEnctype ||
    form.enctype ||
    "application/x-www-form-urlencoded";

  const formData = new FormData(form, submitter ?? undefined);

  const onlyRaw =
    submitter?.getAttribute("data-honox-only") ??
    form.getAttribute("data-honox-only");
  const only = parseOnly(onlyRaw);

  let fetchUrl = new URL(action, location.href).href;
  const headers: Record<string, string> = { "X-Honox-Mode": "json" };
  if (only && only.length > 0) {
    headers["X-Honox-Partial-Data"] = only.join(",");
  }
  const init: RequestInit = {
    method,
    headers,
    credentials: "same-origin",
  };

  if (method === "GET") {
    const params = formDataToParams(formData);
    const u = new URL(fetchUrl);
    u.search = params.toString();
    fetchUrl = u.href;
  } else if (enctype === "multipart/form-data") {
    init.body = formData;
  } else {
    init.body = formDataToParams(formData);
  }

  let response: Response;
  try {
    response = await fetch(fetchUrl, init);
  } catch {
    form.submit();
    return;
  }
  await handleResponse(response, response.url || fetchUrl, {
    updateHistory: true,
  });
}

function formDataToParams(formData: FormData): URLSearchParams {
  const params = new URLSearchParams();
  formData.forEach((value, key) => {
    if (typeof value === "string") params.append(key, value);
  });
  return params;
}

async function handleResponse(
  response: Response,
  finalUrl: string,
  opts: { updateHistory: boolean },
): Promise<void> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    await handleJsonResponse(response, finalUrl, opts);
    return;
  }

  if (!contentType.includes("text/html")) {
    fullReload(finalUrl);
    return;
  }

  await handleHtmlResponse(response, finalUrl, opts);
}

async function handleJsonResponse(
  response: Response,
  finalUrl: string,
  opts: { updateHistory: boolean },
): Promise<void> {
  if (!onPageData) {
    fullReload(finalUrl);
    return;
  }

  const data = (await response.json()) as PageData;

  await onPageData(data);

  if (data.title) document.title = data.title;
  if (opts.updateHistory) {
    history.pushState({}, "", finalUrl);
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

async function handleHtmlResponse(
  response: Response,
  finalUrl: string,
  opts: { updateHistory: boolean },
): Promise<void> {
  const html = await response.text();
  const newDoc = new DOMParser().parseFromString(html, "text/html");

  const newFrames = newDoc.querySelectorAll(`[${FRAME_ATTR}]`);
  if (newFrames.length === 0) {
    fullReload(finalUrl);
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
    fullReload(finalUrl);
    return;
  }

  if (newDoc.title) document.title = newDoc.title;

  if (opts.updateHistory) {
    history.pushState({}, "", finalUrl);
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

function parseOnly(raw: string | null): string[] | undefined {
  if (!raw) return undefined;
  const keys = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return keys.length > 0 ? keys : undefined;
}

type VisitOptions = { only?: string[] };
type ReloadOptions = { only?: string[] };

async function visit(url: string, opts: VisitOptions = {}): Promise<void> {
  await visitLink(url, { only: opts.only });
}

async function reload(opts: ReloadOptions = {}): Promise<void> {
  await visitLink(location.href, {
    only: opts.only,
    updateHistory: false,
  });
}

export const router = { visit, reload };
export type { VisitOptions, ReloadOptions };

export { FRAME_ATTR, MAIN_FRAME };
export type { PageData };
