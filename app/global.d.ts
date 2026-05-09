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
    <P>(
      Component: (props: P) => unknown,
      props: P,
    ): Response | Promise<Response>;
  }
}
