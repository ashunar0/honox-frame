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
    if (!shouldInterceptLink(e, link)) return;
    e.preventDefault();
    void visitLink(link.href);
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

  let fetchUrl = new URL(action, location.href).href;
  const init: RequestInit = {
    method,
    headers: { "X-Honox-Frame": "true" },
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
  if (!contentType.includes("text/html")) {
    fullReload(finalUrl);
    return;
  }

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
