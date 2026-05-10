import type { Contact, ContactInput } from "../../data/contacts";
import type { Organization } from "../../data/organizations";

type Props = {
  contact: Contact;
  organizations: Organization[];
  values?: Partial<ContactInput>;
  errors?: Partial<Record<keyof ContactInput, string>>;
};

export default function ContactsEditPage({
  contact,
  organizations,
  values,
  errors = {},
}: Props) {
  const v = values ?? contact;
  const fullName = `${contact.firstName} ${contact.lastName}`;
  return (
    <div>
      <title>Edit {fullName}</title>

      <header class="mb-6">
        <a
          href={`/contacts/${contact.id}`}
          class="text-sm text-blue-600 hover:underline"
        >
          ← Back to {fullName}
        </a>
        <h1 class="text-3xl font-bold mt-2">Edit Contact</h1>
      </header>

      <form
        method="post"
        action={`/contacts/${contact.id}`}
        class="space-y-4 max-w-xl border border-slate-200 rounded p-6 bg-white"
      >
        <input type="hidden" name="_method" value="PUT" />
        <div class="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" required value={v.firstName} error={errors.firstName} />
          <Field label="Last name" name="lastName" required value={v.lastName} error={errors.lastName} />
        </div>
        <Field label="Email" name="email" type="email" value={v.email} error={errors.email} />
        <Field label="Phone" name="phone" value={v.phone} error={errors.phone} />
        <OrganizationSelect
          organizations={organizations}
          value={v.organizationId}
          error={errors.organizationId}
        />
        <div class="grid grid-cols-2 gap-4">
          <Field label="City" name="city" value={v.city} error={errors.city} />
          <Field label="Country" name="country" value={v.country} error={errors.country} />
        </div>

        <div class="flex gap-2 pt-2">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Save
          </button>
          <a
            href={`/contacts/${contact.id}`}
            class="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  value,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value?: string;
  error?: string;
}) {
  return (
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        required={required}
        class={`w-full border px-3 py-2 rounded text-sm ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      />
      {error && <p class="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function OrganizationSelect({
  organizations,
  value,
  error,
}: {
  organizations: Organization[];
  value?: string;
  error?: string;
}) {
  return (
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">
        Organization
        <span class="text-red-500 ml-1">*</span>
      </label>
      <select
        name="organizationId"
        required
        class={`w-full border px-3 py-2 rounded text-sm bg-white ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      >
        <option value="">— Select organization —</option>
        {organizations.map((o) => (
          <option value={o.id} selected={o.id === value}>
            {o.name}
          </option>
        ))}
      </select>
      {error && <p class="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
