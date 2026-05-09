import { createRoute } from "honox/factory";
import Counter from "../islands/counter";

export default createRoute((c) => {
  return c.render(
    <div>
      <title>About</title>
      <h1 class="text-3xl font-bold mb-4">About</h1>
      <p class="mb-2">HonoX の上に SPA navigation 層を被せる実験なのだ。</p>
      <p class="text-sm text-slate-500 mb-6">Rendered at: {new Date().toLocaleTimeString()}</p>
      <div class="border-t pt-4">
        <p class="text-xs text-slate-500 mb-2">Counter（page / Frame の中）— navigation 後に dead になる予定</p>
        <Counter />
      </div>
    </div>,
  );
});
