import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <div>
      <title>Home</title>
      <h1 class="text-3xl font-bold mb-4">Home</h1>
      <p class="mb-2">これは Home page なのだ。</p>
      <p class="text-sm text-slate-500">Rendered at: {new Date().toLocaleTimeString()}</p>
    </div>,
  );
});
