import type { Context, MiddlewareHandler } from "hono";

type PageProps = Record<string, unknown>;
type PageComponent = (props: any) => unknown;

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
            originalRender as (jsx: unknown, props?: unknown) => Response,
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

function renderPage(
  c: Context,
  originalRender: (jsx: unknown, props?: unknown) => Response,
  Component: PageComponent,
  props: PageProps | undefined,
): Response {
  const mode = c.req.header("X-Honox-Mode") || "html";
  const name = Component.name || "Page";
  const safeProps = props ?? {};

  if (mode === "json") {
    return c.json({
      component: name,
      props: safeProps,
      url: c.req.url,
    });
  }

  const jsx = Component(safeProps);
  return originalRender(jsx);
}
