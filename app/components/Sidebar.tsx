import Counter from "../islands/counter";

export function Sidebar() {
  return (
    <aside class="w-56 p-4 bg-slate-100 border-r">
      <h2 class="font-bold text-lg mb-4">honox-frame</h2>
      <nav class="flex flex-col gap-2 mb-6">
        <a href="/" class="text-blue-600 hover:underline">
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
          Counter（sidebar / Frame の外）
        </p>
        <Counter />
      </div>
    </aside>
  );
}
