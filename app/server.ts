import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";
import { setPageRegistry } from "../src/lib/server/render";

const PAGES = import.meta.glob<{ default: unknown }>(
  "/app/features/**/*.tsx",
  { eager: true },
);

const registry = new Map<unknown, string>();
for (const [path, mod] of Object.entries(PAGES)) {
  const filename = path.split("/").pop()?.replace(/\.tsx$/, "");
  if (filename && mod.default) registry.set(mod.default, filename);
}
setPageRegistry(registry);

const app = createApp();

showRoutes(app);

export default app;
