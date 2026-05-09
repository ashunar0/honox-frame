import { createRoute } from "honox/factory";
import Messages from "../pages/Messages";

const messages: string[] = [];

function loadMessages() {
  console.log("[messages] computed");
  return messages.slice();
}

export const GET = createRoute((c) => {
  return c.render(Messages, { messages: loadMessages });
});

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  const text = body.text;

  if (typeof text === "string" && text.trim()) {
    messages.push(text.trim());
  }

  return c.redirect("/messages", 303);
});
