import type { ContactWithOrganization } from "../../data/contacts";

type Props = {
  contact: ContactWithOrganization;
};

export default function ContactsDetailPage({ contact }: Props) {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  return (
    <div>
      <title>{fullName}</title>

      <header class="mb-6">
        <a
          href="/contacts"
          class="text-sm text-blue-600 hover:underline"
        >
          ← Back to Contacts
        </a>
        <div class="flex items-center justify-between mt-2">
          <h1 class="text-3xl font-bold">{fullName}</h1>
          <div class="flex gap-2">
            <a
              href={`/contacts/${contact.id}/edit`}
              class="px-3 py-1.5 text-sm border border-slate-300 rounded hover:bg-slate-50"
            >
              Edit
            </a>
            <form
              method="post"
              action={`/contacts/${contact.id}`}
              onsubmit="return confirm('Delete this contact?')"
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
        <Desc>{contact.email || "—"}</Desc>
        <Term>Phone</Term>
        <Desc>{contact.phone || "—"}</Desc>
        <Term>Organization</Term>
        <Desc>
          {contact.organization ? (
            <a
              href={`/organizations/${contact.organization.id}`}
              class="text-blue-600 hover:underline"
            >
              {contact.organization.name}
            </a>
          ) : (
            <span class="text-slate-400 italic">—</span>
          )}
        </Desc>
        <Term>City</Term>
        <Desc>{contact.city || "—"}</Desc>
        <Term>Country</Term>
        <Desc>{contact.country || "—"}</Desc>
        <Term>Created</Term>
        <Desc>
          <time>{new Date(contact.createdAt).toLocaleString()}</time>
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
