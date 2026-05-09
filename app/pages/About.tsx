import Counter from "../islands/counter";

export default function About() {
  return (
    <div>
      <title>About</title>
      <h1 class="text-3xl font-bold mb-4">About</h1>
      <p class="mb-2">HonoX の上に SPA navigation 層を被せる実験なのだ。</p>
      <p class="text-sm text-slate-500 mb-6">
        Rendered at: {new Date().toLocaleTimeString()}
      </p>
      <div class="border-t pt-4">
        <p class="text-xs text-slate-500 mb-2">
          Counter（page / Frame の中）— Phase 3.5 で state 維持できるかは
          page 識別が変わるかで決まる
        </p>
        <Counter />
      </div>
    </div>
  );
}
