import type {} from "hono";

declare module "hono" {
  interface Env {
    Variables: {};
    Bindings: {};
  }

  interface ContextRenderer {
    (
      content: string | Promise<string>,
      rendererProps?: any,
    ): Response | Promise<Response>;
    (Component: () => unknown): Response | Promise<Response>;
    <P>(
      Component: (props: P) => unknown,
      props: { [K in keyof P]: P[K] | (() => P[K] | Promise<P[K]>) },
    ): Response | Promise<Response>;
  }
}
