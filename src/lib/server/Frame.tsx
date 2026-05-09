import type { Child } from "hono/jsx";

export function Frame({ id, children }: { id: string; children?: Child }) {
  return <div data-honox-frame={id}>{children}</div>;
}
