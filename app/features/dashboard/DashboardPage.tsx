import RefreshStats from "../../islands/refresh-stats";

type Stats = {
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
        ある架空の会社の社内 CRM。 sidebar が維持されたまま各画面を navigate できるのだ。
      </p>

      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold">Stats</h2>
        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-500">
            fetched {formatTime(stats.fetchedAt)}
          </span>
          <RefreshStats />
        </div>
      </div>
      <p class="text-xs text-slate-400 mb-3">
        ↑ 「Refresh stats」を押すと <code>data-honox-only="stats"</code>{" "}
        相当の partial reload が走り、 sidebar も page 全体も再 fetch されない。
      </p>

      <div class="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Organizations" value={stats.organizations} href="/organizations" />
        <StatCard label="Contacts" value={stats.contacts} href="/contacts" />
      </div>

      <section class="border border-slate-200 rounded p-4">
        <h2 class="text-lg font-bold mb-2">Recent activity</h2>
        <p class="text-sm text-slate-400 italic">
          まだ何もないのだ。 Organizations / Contacts を追加すると表示される予定。
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

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
