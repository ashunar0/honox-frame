import type { ListResult } from "../../data/organizations";
import SearchInput from "../../islands/search-input";

type Props = {
  result: ListResult;
  search: string;
};

const PARTIAL_KEYS = ["result", "search"];

export default function OrganizationsListPage({ result, search }: Props) {
  return (
    <div>
      <title>Organizations</title>

      <header class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Organizations</h1>
        <a
          href="/organizations/new"
          class="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
        >
          + New Organization
        </a>
      </header>

      <form
        method="get"
        action="/organizations"
        class="mb-4 flex gap-2"
        data-honox-only={PARTIAL_KEYS.join(",")}
      >
        <SearchInput
          initial={search}
          action="/organizations"
          only={PARTIAL_KEYS}
          placeholder="Search by name / email / city / country..."
        />
        <button
          type="submit"
          class="px-4 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-800"
        >
          Search
        </button>
        {search && (
          <a
            href="/organizations"
            class="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50"
            data-honox-only={PARTIAL_KEYS.join(",")}
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
          一致する Organization がないのだ。
        </p>
      ) : (
        <div class="border border-slate-200 rounded overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="text-left px-4 py-2">Name</th>
                <th class="text-left px-4 py-2">Email</th>
                <th class="text-left px-4 py-2">City</th>
                <th class="text-left px-4 py-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((o) => (
                <tr class="border-t border-slate-100 hover:bg-slate-50">
                  <td class="px-4 py-2">
                    <a
                      href={`/organizations/${o.id}`}
                      class="text-blue-600 hover:underline font-medium"
                    >
                      {o.name}
                    </a>
                  </td>
                  <td class="px-4 py-2 text-slate-600">{o.email}</td>
                  <td class="px-4 py-2 text-slate-600">{o.city}</td>
                  <td class="px-4 py-2 text-slate-600">{o.country}</td>
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
    return `/organizations${qs ? `?${qs}` : ""}`;
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
            data-honox-only="result"
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
            data-honox-only="result"
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
