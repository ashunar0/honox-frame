type Props = {
  values?: { email?: string };
  error?: string;
};

export default function LoginPage({ values = {}, error }: Props) {
  return (
    <div class="min-h-screen flex items-center justify-center bg-slate-50">
      <title>Sign in</title>
      <form
        method="post"
        action="/login"
        data-no-frame
        class="w-96 p-8 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4"
      >
        <header class="space-y-1">
          <h1 class="text-2xl font-bold">Sign in</h1>
          <p class="text-xs text-slate-500">
            Demo account:{" "}
            <code class="bg-slate-100 px-1 rounded">admin@acme.example</code>{" "}
            / <code class="bg-slate-100 px-1 rounded">password</code>
          </p>
        </header>

        {error && (
          <p class="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={values.email ?? ""}
            required
            autofocus
            class="w-full border border-slate-300 px-3 py-2 rounded text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            class="w-full border border-slate-300 px-3 py-2 rounded text-sm"
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
