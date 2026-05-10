import type {} from "hono";
import type { User } from "./data/users";

declare module "hono" {
  interface Env {
    Variables: {
      user?: User;
    };
    Bindings: {
      DB: D1Database;
      SESSION_SECRET?: string;
    };
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
