import { useEffect, useState } from "hono/jsx";
import { router } from "../../src/lib/client/navigate";

type Props = {
  initial: string;
  action: string;
  only: string[];
  paramName?: string;
  placeholder?: string;
};

const DEBOUNCE_MS = 250;

export default function SearchInput({
  initial,
  action,
  only,
  paramName = "search",
  placeholder,
}: Props) {
  const [value, setValue] = useState(initial);
  const debounced = useDebouncedValue(value, DEBOUNCE_MS);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  useEffect(() => {
    if (debounced === initial) return;
    void router.visit(buildUrl(action, paramName, debounced), { only });
  }, [debounced]);

  return (
    <input
      type="text"
      name={paramName}
      value={value}
      onInput={(e) => setValue((e.currentTarget as HTMLInputElement).value)}
      placeholder={placeholder}
      class="border border-slate-300 px-3 py-2 rounded flex-1 text-sm"
    />
  );
}

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(id);
  }, [value]);
  return debounced;
}

function buildUrl(action: string, paramName: string, value: string): string {
  const params = new URLSearchParams();
  if (value) params.set(paramName, value);
  const qs = params.toString();
  return `${action}${qs ? `?${qs}` : ""}`;
}
