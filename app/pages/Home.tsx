import Counter from "../islands/counter";

export default function Home() {
  return (
    <div>
      <title>Home</title>
      <h1 class="text-3xl font-bold mb-4">Home</h1>
      <p class="mb-2">これは Home page なのだ。</p>
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
