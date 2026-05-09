import { createRoute } from "honox/factory";
import Dashboard from "../pages/Dashboard";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function loadUsers() {
  console.log("[dashboard] users computed");
  await sleep(100);
  return {
    fetchedAt: stamp(),
    items: ["alice", "bob", "carol"],
  };
}

async function loadPosts() {
  console.log("[dashboard] posts computed");
  await sleep(300);
  return {
    fetchedAt: stamp(),
    items: [
      "Phase 3.5 で state preservation を実装した",
      "Inertia 流の App layer で diff が効くようになった",
      "次は partial reload",
    ],
  };
}

async function loadStats() {
  console.log("[dashboard] stats computed");
  await sleep(500);
  return {
    fetchedAt: stamp(),
    totalUsers: 3,
    totalPosts: 3,
  };
}

function stamp(): string {
  const d = new Date();
  return `${d.toLocaleTimeString()}.${String(d.getMilliseconds()).padStart(3, "0")}`;
}

export default createRoute((c) => {
  return c.render(Dashboard, {
    users: loadUsers,
    posts: loadPosts,
    stats: loadStats,
  });
});
