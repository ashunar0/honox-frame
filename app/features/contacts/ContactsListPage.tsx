import type { ListResult } from "../../data/contacts";

type Props = {
  result: ListResult;
  search: string;
};

export default function ContactsListPage({ result, search }: Props) {
  return (
    <div>
      <title>Contacts</title>

      <header class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Contacts</h1>
        <a
          href="/contacts/new"
          class="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
        >
          + New Contact
        </a>
      </header>

      <form method="get" action="/contacts" class="mb-4 flex gap-2">
        <input
          type="text"
          name="search"
          value={search}
          placeholder="Search by name / email / city / country..."
          class="border border-slate-300 px-3 py-2 rounded flex-1 text-sm"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-800"
        >
          Search
        </button>
        {search && (
          <a
            href="/contacts"
            class="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50"
          >
            Clear
          </a>
        )}
      </form>

      <p class="text-sm text-slate-500 mb-3">
        {result.total} {result.total === 1 ? "result" : "results"}
        {search && ` for "${search}"`}
      </p>

      {result.items.length === 0 ? (
        <p class="text-slate-400 italic py-8 text-center border border-dashed border-slate-300 rounded">
          一致する Contact がないのだ。
        </p>
      ) : (
        <div class="border border-slate-200 rounded overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="text-left px-4 py-2">Name</th>
                <th class="text-left px-4 py-2">Email</th>
                <th class="text-left px-4 py-2">Organization</th>
                <th class="text-left px-4 py-2">City</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((c) => (
                <tr class="border-t border-slate-100 hover:bg-slate-50">
                  <td class="px-4 py-2">
                    <a
                      href={`/contacts/${c.id}`}
                      class="text-blue-600 hover:underline font-medium"
                    >
                      {c.lastName}, {c.firstName}
                    </a>
                  </td>
                  <td class="px-4 py-2 text-slate-600">{c.email}</td>
                  <td class="px-4 py-2 text-slate-600">
                    {c.organization ? (
                      <a
                        href={`/organizations/${c.organization.id}`}
                        class="text-blue-600 hover:underline"
                      >
                        {c.organization.name}
                      </a>
                    ) : (
                      <span class="text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td class="px-4 py-2 text-slate-600">{c.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.totalPages > 1 && (
        <Pagination result={result} search={search} />
      )}
    </div>
  );
}

function Pagination({ result, search }: { result: ListResult; search: string }) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/contacts${qs ? `?${qs}` : ""}`;
  };

  const prev = result.page > 1 ? result.page - 1 : null;
  const next = result.page < result.totalPages ? result.page + 1 : null;

  return (
    <nav class="flex items-center justify-between mt-4 text-sm">
      <span class="text-slate-500">
        Page {result.page} / {result.totalPages}
      </span>
      <div class="flex gap-2">
        {prev !== null ? (
          <a
            href={buildHref(prev)}
            class="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50"
          >
            ← Prev
          </a>
        ) : (
          <span class="px-3 py-1 border border-slate-200 text-slate-300 rounded">
            ← Prev
          </span>
        )}
        {next !== null ? (
          <a
            href={buildHref(next)}
            class="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50"
          >
            Next →
          </a>
        ) : (
          <span class="px-3 py-1 border border-slate-200 text-slate-300 rounded">
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}
