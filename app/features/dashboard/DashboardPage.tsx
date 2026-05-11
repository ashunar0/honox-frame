import Counter from "../../islands/counter";
import RefreshStats from "../../islands/refresh-stats";

export type Stats = {
  organizations: number;
  contacts: number;
  fetchedAt: string;
};

type Props = {
  stats: Stats;
};

export default function DashboardPage({ stats }: Props) {
  return (
    <div>
      <title>Dashboard</title>
      <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
      <p class="text-sm text-slate-500 mb-6">
        A demo CRM for a fictional company. The sidebar persists across navigation between pages.
      </p>

      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold">Stats</h2>
        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-500">
            fetched {new Date(stats.fetchedAt).toLocaleTimeString()}
          </span>
          <RefreshStats />
        </div>
      </div>
      <p class="text-xs text-slate-400 mb-3">
        Click "Refresh stats" to trigger a partial reload via{" "}
        <code>data-honox-only="stats"</code>. The sidebar and the rest of the
        page are not re-fetched.
      </p>

      <div class="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Organizations" value={stats.organizations} href="/organizations" />
        <StatCard label="Contacts" value={stats.contacts} href="/contacts" />
      </div>

      <section class="border border-slate-200 rounded p-4 mb-4">
        <p class="text-xs text-slate-500 mb-2">
          Counter (inside the page)
        </p>
        <Counter />
      </section>

      <section class="border border-slate-200 rounded p-4">
        <h2 class="text-lg font-bold mb-2">Recent activity</h2>
        <p class="text-sm text-slate-400 italic">
          Nothing yet. Activity will appear here as you add organizations and contacts.
        </p>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <a
      href={href}
      class="block border border-slate-200 rounded p-4 hover:border-blue-400 hover:bg-blue-50 transition"
    >
      <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">
        {label}
      </div>
      <div class="text-3xl font-bold">{value}</div>
    </a>
  );
}

