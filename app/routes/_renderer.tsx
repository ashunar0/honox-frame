import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { Frame } from "../../src/lib/server/Frame";
import { withHonoxFrame } from "../../src/lib/server/render";
import { Sidebar } from "../components/Sidebar";

const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body>
        <div class="min-h-screen flex">
          <Sidebar />
          <main class="flex-1 p-8">
            <Frame id="main">{children}</Frame>
          </main>
        </div>
      </body>
    </html>
  );
});

export default withHonoxFrame(renderer);
