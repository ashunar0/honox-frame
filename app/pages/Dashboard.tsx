type Section = {
  fetchedAt: string;
};

type Users = Section & { items: string[] };
type Posts = Section & { items: string[] };
type Stats = Section & { totalUsers: number; totalPosts: number };

type Props = {
  users: Users;
  posts: Posts;
  stats: Stats;
};

export default function Dashboard({ users, posts, stats }: Props) {
  return (
    <div>
      <title>Dashboard</title>
      <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
      <p class="text-sm text-slate-500 mb-6">
        各セクションの refresh ボタンを押すと、本当はそのセクションだけ更新したいのに
        全 props が毎回計算される（server log と timestamp で確認できる）
      </p>

      <div class="flex gap-2 mb-6">
        <a
          href="/dashboard?refresh=all"
          class="px-3 py-1.5 text-sm bg-slate-700 text-white rounded"
        >
          全部更新
        </a>
      </div>

      <Card title="Users" sub="100ms delay" fetchedAt={users.fetchedAt} refreshTo="/dashboard?refresh=users" only="users">
        <ul class="text-sm space-y-1">
          {users.items.map((u) => (
            <li>{u}</li>
          ))}
        </ul>
      </Card>

      <Card title="Posts" sub="300ms delay" fetchedAt={posts.fetchedAt} refreshTo="/dashboard?refresh=posts" only="posts">
        <ul class="text-sm space-y-1">
          {posts.items.map((p) => (
            <li>{p}</li>
          ))}
        </ul>
      </Card>

      <Card title="Stats" sub="500ms delay" fetchedAt={stats.fetchedAt} refreshTo="/dashboard?refresh=stats" only="stats">
        <dl class="text-sm grid grid-cols-2 gap-1">
          <dt class="text-slate-500">Total users</dt>
          <dd>{stats.totalUsers}</dd>
          <dt class="text-slate-500">Total posts</dt>
          <dd>{stats.totalPosts}</dd>
        </dl>
      </Card>
    </div>
  );
}

function Card({
  title,
  sub,
  fetchedAt,
  refreshTo,
  only,
  children,
}: {
  title: string;
  sub: string;
  fetchedAt: string;
  refreshTo: string;
  only: string;
  children?: unknown;
}) {
  return (
    <section class="border border-slate-200 rounded p-4 mb-4">
      <header class="flex items-baseline justify-between mb-3">
        <div>
          <h2 class="text-lg font-bold">{title}</h2>
          <p class="text-xs text-slate-500">{sub}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-500 font-mono">
            fetched: {fetchedAt}
          </span>
          <a
            href={refreshTo}
            data-honox-only={only}
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded"
          >
            このセクションだけ refresh
          </a>
        </div>
      </header>
      {children as never}
    </section>
  );
}
