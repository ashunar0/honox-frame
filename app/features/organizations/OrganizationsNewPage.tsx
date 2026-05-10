import type { OrganizationInput } from "../../data/organizations";

type Props = {
  values?: Partial<OrganizationInput>;
  errors?: Partial<Record<keyof OrganizationInput, string>>;
};

export default function OrganizationsNewPage({ values = {}, errors = {} }: Props) {
  return (
    <div>
      <title>New Organization</title>

      <header class="mb-6">
        <a
          href="/organizations"
          class="text-sm text-blue-600 hover:underline"
        >
          ← Back to Organizations
        </a>
        <h1 class="text-3xl font-bold mt-2">New Organization</h1>
      </header>

      <form
        method="post"
        action="/organizations"
        class="space-y-4 max-w-xl border border-slate-200 rounded p-6 bg-white"
      >
        <Field
          label="Name"
          name="name"
          required
          value={values.name}
          error={errors.name}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={values.email}
          error={errors.email}
        />
        <Field
          label="Phone"
          name="phone"
          value={values.phone}
          error={errors.phone}
        />
        <div class="grid grid-cols-2 gap-4">
          <Field
            label="City"
            name="city"
            value={values.city}
            error={errors.city}
          />
          <Field
            label="Country"
            name="country"
            value={values.country}
            error={errors.country}
          />
        </div>

        <div class="flex gap-2 pt-2">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Create
          </button>
          <a
            href="/organizations"
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
      {error && (
        <p class="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
