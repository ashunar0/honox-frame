import { useState } from "hono/jsx";
import { toast } from "../../src/lib/client/app";
import { router } from "../../src/lib/client/navigate";

export default function RefreshStats() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await router.reload({ only: ["stats"] });
      toast.info("Stats refreshed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      class="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? "Refreshing…" : "Refresh stats"}
    </button>
  );
}
