import type { Contact } from "../../data/contacts";
import type { Organization } from "../../data/organizations";

type Props = {
  organization: Organization;
  contacts: Contact[];
};

export default function OrganizationsDetailPage({
  organization,
  contacts,
}: Props) {
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
              onsubmit="return confirm('Delete this organization?')"
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

      <section class="mt-8 max-w-xl">
        <header class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-bold">
            Contacts <span class="text-slate-400 font-normal">({contacts.length})</span>
          </h2>
          <a
            href="/contacts/new"
            class="text-sm text-blue-600 hover:underline"
          >
            + Add contact
          </a>
        </header>
        {contacts.length === 0 ? (
          <p class="text-sm text-slate-400 italic py-4 text-center border border-dashed border-slate-300 rounded">
            No contacts linked to this organization yet.
          </p>
        ) : (
          <ul class="border border-slate-200 rounded divide-y divide-slate-100 bg-white">
            {contacts.map((c) => (
              <li class="px-4 py-2 text-sm hover:bg-slate-50">
                <a
                  href={`/contacts/${c.id}`}
                  class="flex items-baseline justify-between"
                >
                  <span class="text-blue-600 hover:underline font-medium">
                    {c.firstName} {c.lastName}
                  </span>
                  <span class="text-slate-500 text-xs">{c.email}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
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
