import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div>
      <title>About</title>
      <h1 class="text-3xl font-bold mb-4">About</h1>
      <p class="mb-2">HonoX の上に SPA navigation 層を被せる実験なのだ。</p>
      <p class="text-sm text-slate-500">Rendered at: {new Date().toLocaleTimeString()}</p>
    </div>
  )
})
