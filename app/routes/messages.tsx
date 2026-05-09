import { createRoute } from "honox/factory";

const messages: string[] = [];

export const GET = createRoute((c) => {
  return c.render(
    <div>
      <title>Messages</title>
      <h1 class="text-3xl font-bold mb-4">Messages</h1>
      <p class="text-sm text-slate-500 mb-6">
        Rendered at: {new Date().toLocaleTimeString()}
      </p>

      <form method="POST" action="/messages" class="mb-6 flex gap-2">
        <input
          type="text"
          name="text"
          placeholder="メッセージを入力"
          required
          class="border border-slate-300 px-3 py-2 rounded flex-1"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          投稿
        </button>
      </form>

      {messages.length === 0 ? (
        <p class="text-slate-400 italic">まだメッセージはないのだ。</p>
      ) : (
        <ul class="space-y-2">
          {messages.map((m) => (
            <li class="border-b pb-2">{m}</li>
          ))}
        </ul>
      )}
    </div>,
  );
});

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  const text = body.text;
  if (typeof text === "string" && text.trim()) {
    messages.push(text.trim());
  }
  return c.redirect("/messages", 303);
});
