import type { Organization } from "../../data/organizations";

type Props = {
  organization: Organization;
};

export default function OrganizationsDetailPage({ organization }: Props) {
  return (
    <div>
      <title>{organization.name}</title>

      <header class="mb-6">
        <a
          href="/organizations"
          class="text-sm text-blue-600 hover:underline"
        >
          ← Back to Organizations
        </a>
        <div class="flex items-center justify-between mt-2">
          <h1 class="text-3xl font-bold">{organization.name}</h1>
          <div class="flex gap-2">
            <a
              href={`/organizations/${organization.id}/edit`}
              class="px-3 py-1.5 text-sm border border-slate-300 rounded hover:bg-slate-50"
            >
              Edit
            </a>
            <form
              method="post"
              action={`/organizations/${organization.id}`}
              onsubmit="return confirm('この Organization を削除するのだ？')"
              class="inline"
            >
              <input type="hidden" name="_method" value="DELETE" />
              <button
                type="submit"
                class="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </header>

      <dl class="border border-slate-200 rounded p-6 bg-white grid grid-cols-[140px_1fr] gap-y-3 gap-x-4 text-sm max-w-xl">
        <Term>Email</Term>
        <Desc>{organization.email || "—"}</Desc>
        <Term>Phone</Term>
        <Desc>{organization.phone || "—"}</Desc>
        <Term>City</Term>
        <Desc>{organization.city || "—"}</Desc>
        <Term>Country</Term>
        <Desc>{organization.country || "—"}</Desc>
        <Term>Created</Term>
        <Desc>
          <time>{new Date(organization.createdAt).toLocaleString()}</time>
        </Desc>
      </dl>
    </div>
  );
}

function Term({ children }: { children?: unknown }) {
  return (
    <dt class="text-slate-500 uppercase tracking-wide text-xs self-center">
      {children as never}
    </dt>
  );
}

function Desc({ children }: { children?: unknown }) {
  return <dd class="text-slate-800">{children as never}</dd>;
}
