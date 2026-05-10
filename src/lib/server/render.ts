import type { Context, MiddlewareHandler } from "hono";
import { Fragment, createElement } from "hono/jsx";
import { consumeFlash, setFlash, type FlashPayload } from "./flash";

type PageProps = Record<string, unknown>;
type PageComponent = (props: any) => unknown;

export const PAGE_META_ID = "__honox_page__";

export type ForwardOptions = { flash?: FlashPayload };
export type BackOptions = { flash?: FlashPayload; fallback?: string };

declare module "hono" {
  interface Context {
    forward(url: string, opts?: ForwardOptions): Response;
    back(opts?: BackOptions): Response;
  }
}

export function withHonoxFrame(
  innerMiddleware: MiddlewareHandler,
): MiddlewareHandler {
  return async (c, next) => {
    await innerMiddleware(c, async () => {
      const originalRender = c.render;
      c.render = ((componentOrJsx: unknown, props?: unknown) => {
        if (typeof componentOrJsx === "function") {
          return renderPage(
            c,
            originalRender as (jsx: unknown) => Response,
            componentOrJsx as PageComponent,
            props as PageProps | undefined,
          );
        }
        return (originalRender as (jsx: unknown, props?: unknown) => Response)(
          componentOrJsx,
          props,
        );
      }) as typeof c.render;

      c.forward = (url, opts = {}) => {
        if (opts.flash) setFlash(c, opts.flash);
        return c.redirect(url, 303);
      };

      c.back = (opts = {}) => {
        const url = c.req.header("referer") || opts.fallback || "/";
        return c.forward(url, { flash: opts.flash });
      };

      await next();
    });
  };
}

async function renderPage(
  c: Context,
  originalRender: (jsx: unknown) => Response,
  Component: PageComponent,
  props: PageProps | undefined,
): Promise<Response> {
  const mode = c.req.header("X-Honox-Mode") || "html";
  const name = Component.name || "Page";
  const partial =
    mode === "json"
      ? parsePartialHeader(c.req.header("X-Honox-Partial-Data"))
      : null;
  const resolvedProps = await resolveProps(props ?? {}, partial);
  const flash = partial ? null : consumeFlash(c);

  if (mode === "json") {
    return c.json({
      component: name,
      props: resolvedProps,
      url: c.req.url,
      partial: partial ?? undefined,
      flash: flash ?? undefined,
    });
  }

  const meta = serializePageMeta({
    component: name,
    props: resolvedProps,
    url: c.req.url,
    flash: flash ?? undefined,
  });

  const scriptEl = createElement("script", {
    id: PAGE_META_ID,
    type: "application/json",
    dangerouslySetInnerHTML: { __html: meta },
  } as any);
  const pageEl = createElement(Component, resolvedProps);
  const wrapped = createElement(Fragment, null, scriptEl as any, pageEl as any);

  return originalRender(wrapped);
}

async function resolveProps(
  props: PageProps,
  partial: string[] | null,
): Promise<PageProps> {
  const result: PageProps = {};
  const tasks: Promise<void>[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (partial && !partial.includes(key)) continue;
    if (typeof value === "function") {
      tasks.push(
        Promise.resolve((value as () => unknown)()).then((resolved) => {
          result[key] = resolved;
        }),
      );
    } else {
      result[key] = value;
    }
  }
  await Promise.all(tasks);
  return result;
}

function serializePageMeta(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function parsePartialHeader(raw: string | undefined): string[] | null {
  if (!raw) return null;
  const keys = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return keys.length > 0 ? keys : null;
}
