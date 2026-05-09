import type { Context, MiddlewareHandler } from "hono";
import { Fragment, createElement } from "hono/jsx";

type PageProps = Record<string, unknown>;
type PageComponent = (props: any) => unknown;

export const PAGE_META_ID = "__honox_page__";

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

  if (mode === "json") {
    return c.json({
      component: name,
      props: resolvedProps,
      url: c.req.url,
      partial: partial ?? undefined,
    });
  }

  const meta = serializePageMeta({
    component: name,
    props: resolvedProps,
    url: c.req.url,
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
