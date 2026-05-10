import type { User } from "../data/users";
import Counter from "../islands/counter";

type Props = {
  user?: User | null;
};

export function Sidebar({ user }: Props = {}) {
  return (
    <aside class="w-56 p-4 bg-slate-100 border-r flex flex-col min-h-screen">
      <h2 class="font-bold text-lg mb-4">honox-frame</h2>
      <nav class="flex flex-col gap-2 mb-6">
        <a href="/dashboard" class="text-blue-600 hover:underline">
          Dashboard
        </a>
        <a href="/organizations" class="text-blue-600 hover:underline">
          Organizations
        </a>
        <a href="/contacts" class="text-blue-600 hover:underline">
          Contacts
        </a>
      </nav>
      <div class="border-t pt-4">
        <p class="text-xs text-slate-500 mb-2">
          Counter (outside the Frame)
        </p>
        <Counter />
      </div>
      {user && (
        <div class="border-t pt-4 mt-auto">
          <p class="text-xs text-slate-500 mb-1">Signed in as</p>
          <p class="text-sm font-medium mb-2">{user.name}</p>
          <form method="post" action="/logout" data-no-frame>
            <button
              type="submit"
              class="text-xs text-red-600 hover:underline cursor-pointer"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
