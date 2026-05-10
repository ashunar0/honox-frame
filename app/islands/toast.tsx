import { useEffect, useState } from "hono/jsx";
import { FLASH_EVENT } from "../../src/lib/client/app";

type Level = "success" | "error" | "info";

type FlashItem = {
  id: number;
  level: Level;
  message: string;
};

const LEVEL_CLASS: Record<Level, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-slate-800 text-white",
};

const AUTO_DISMISS_MS = 4000;

export default function Toast() {
  const [items, setItems] = useState<FlashItem[]>([]);

  useEffect(() => {
    let nextId = 0;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Record<string, unknown>;
      if (!detail || typeof detail !== "object") return;
      const added: FlashItem[] = [];
      for (const [level, message] of Object.entries(detail)) {
        if (typeof message !== "string") continue;
        if (level !== "success" && level !== "error" && level !== "info") continue;
        added.push({ id: nextId++, level, message });
      }
      if (added.length === 0) return;
      setItems((prev) => [...prev, ...added]);
      added.forEach((item) => {
        setTimeout(() => {
          setItems((prev) => prev.filter((x) => x.id !== item.id));
        }, AUTO_DISMISS_MS);
      });
    };
    window.addEventListener(FLASH_EVENT, handler);
    return () => window.removeEventListener(FLASH_EVENT, handler);
  }, []);

  if (items.length === 0) return null;

  return (
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {items.map((item) => (
        <div
          key={item.id}
          class={`px-4 py-2 rounded shadow text-sm pointer-events-auto ${LEVEL_CLASS[item.level]}`}
          role="status"
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
