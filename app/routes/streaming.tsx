import { createRoute } from "honox/factory";
import { Suspense, renderToReadableStream } from "hono/jsx/streaming";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function SlowSection() {
  console.log("[streaming] SlowSection start");
  await sleep(2000);
  console.log("[streaming] SlowSection resolved");
  return (
    <div class="border border-emerald-300 rounded p-4 mb-4 bg-emerald-50">
      <h2 class="text-lg font-bold mb-2">Slow content (took 2s)</h2>
      <p class="text-sm">この section は 2 秒待ってから後の chunk として届いたのだ。</p>
    </div>
  );
}

async function VerySlowSection() {
  console.log("[streaming] VerySlowSection start");
  await sleep(4000);
  console.log("[streaming] VerySlowSection resolved");
  return (
    <div class="border border-purple-300 rounded p-4 bg-purple-50">
      <h2 class="text-lg font-bold mb-2">Very slow content (took 4s)</h2>
      <p class="text-sm">この section は 4 秒。並列に解決されるはず。</p>
    </div>
  );
}

export default createRoute((c) => {
  const stream = renderToReadableStream(
    <html>
      <head>
        <title>Streaming PoC</title>
        <link rel="stylesheet" href="/app/style.css" />
      </head>
      <body class="p-8 max-w-2xl mx-auto font-sans">
        <h1 class="text-3xl font-bold mb-4">Phase 5-A: Streaming SSR PoC</h1>
        <p class="text-sm text-slate-500 mb-6">
          shell は即座に表示されて、Suspense 内の section は
          後の chunk として届くはずなのだ。
        </p>
        <Suspense
          fallback={
            <div class="border border-slate-300 rounded p-4 mb-4 bg-slate-100">
              <p class="text-slate-500">Loading slow section...</p>
            </div>
          }
        >
          <SlowSection />
        </Suspense>
        <Suspense
          fallback={
            <div class="border border-slate-300 rounded p-4 bg-slate-100">
              <p class="text-slate-500">Loading very slow section...</p>
            </div>
          }
        >
          <VerySlowSection />
        </Suspense>
        <p class="text-xs text-slate-400 mt-6">
          (footer は最初の chunk に含まれているのだ)
        </p>
      </body>
    </html>,
  );
  return c.body(stream, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Transfer-Encoding": "chunked",
    },
  });
});
