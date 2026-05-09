import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { Frame } from "../../src/lib/server/Frame";
import { withHonoxFrame } from "../../src/lib/server/render";
import Counter from "../islands/counter";

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
          <aside class="w-56 p-4 bg-slate-100 border-r">
            <h2 class="font-bold text-lg mb-4">honox-frame</h2>
            <nav class="flex flex-col gap-2 mb-6">
              <a href="/" class="text-blue-600 hover:underline">
                Home
              </a>
              <a href="/about" class="text-blue-600 hover:underline">
                About
              </a>
              <a href="/messages" class="text-blue-600 hover:underline">
                Messages
              </a>
            </nav>
            <div class="border-t pt-4">
              <p class="text-xs text-slate-500 mb-2">
                Counter（sidebar / Frame の外）
              </p>
              <Counter />
            </div>
          </aside>
          <main class="flex-1 p-8">
            <Frame id="main">{children}</Frame>
          </main>
        </div>
      </body>
    </html>
  );
});

export default withHonoxFrame(renderer);
