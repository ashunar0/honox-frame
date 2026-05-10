# honox-frame

> HonoX 上に乗せる **client navigation + state delivery** の extension layer。
> Hotwire でも Inertia でもない、backend-first FW の第 3 の選択肢を狙う実験プロジェクト（仮名）。

```
HonoX (MPA + islands) + SPA navigation + 3-mode envelope flexibility
```

## position

| FW | wire format | client runtime | direction |
|---|---|---|---|
| Hotwire | HTML only | Stimulus | Rails 進化 |
| Inertia | JSON only | React / Vue | SPA 起点 |
| **honox-frame** | HTML + JSON + Frame の 3-mode | hono/jsx/dom (~5kb) | HonoX 進化 |

## quick start

```bash
bun install
bun run dev          # http://localhost:5173
```

Demo account: `admin@acme.example` / `password`

`app/` 以下が show case（Ping CRM 風 mini SaaS）になっていて、現バージョンの全機能を demonstrate する。

## what works

show case で確認できる機能：

- **Frame swap** — sidebar 維持で main 領域だけ差し替わる SPA navigation
- **Islands re-hydrate** — page 遷移後も Counter island は state を維持
- **Form intercept** — `<form>` submit を SPA navigation に intercept、`_method=DELETE` 等の override 対応
- **Persistent App layer** — Frame 内の component state が遷移を跨いで持続
- **Partial reload** — `router.reload({ only: ["stats"] })` で envelope の特定 prop だけ再 fetch（Dashboard）
- **Flash messaging** — `c.forward(url, { flash })` / `c.back({ flash, fallback })` で Inertia 風 flash、layout 一個の persistent Toast island に届く
- **Route group + group 別 renderer/middleware** — `(auth)/(app)` で layout と middleware を group ごとに完結

## stack

- **Hono** 4.12 — backend core
- **HonoX** 0.1.55 — foundation（fork せず dependency として使う）
- **hono/jsx/dom** — client runtime
- **Vite** 8 — build tool
- **Bun** — package manager
- **Cloudflare Workers** — primary deploy target
- **Tailwind CSS v4** — styling

## structure

```
honox-frame/
├── app/                      ← HonoX 既定
│   ├── routes/
│   │   ├── (auth)/           ← sidebar 無し group（login）
│   │   └── (app)/            ← sidebar あり + 認証 middleware
│   ├── features/<domain>/    ← page と関連 component の colocation
│   ├── islands/              ← Counter / Toast / RefreshStats
│   ├── components/           ← 横断 UI（Sidebar）
│   ├── data/                 ← in-memory store（D1 移行想定）
│   ├── lib/                  ← app 固有 helpers（auth）
│   ├── client.ts             ← honox-frame client bootstrap
│   └── server.ts
├── src/lib/                  ← honox-frame 独自 runtime
│   ├── client/               ← link/form intercept、frame swap、flash dispatch
│   └── server/               ← <Frame>、c.render overload、c.forward / c.back
└── docs/
    └── roadmap.md            ← 設計の single source of truth
```

PoC が固まったら `src/lib/` を `@xxx/honox-frame` package に extract して publish 予定。

## design principles

- **HonoX を fork しない** — dependency として使う。hook が必要なら HonoX 本体に PR
- **React は使わない** — bundle size と Hono ecosystem 純度を優先、client は hono/jsx/dom
- **Flight protocol は不採用** — wire format は HTML + JSON + Frame の 3-mode envelope

設計の意図と決定経緯は [docs/roadmap.md](docs/roadmap.md) に集約。

## scripts

| command | 用途 |
|---|---|
| `bun run dev` | Vite dev server |
| `bun run build` | production build |
| `bun run preview` | wrangler dev |
| `bun run deploy` | Cloudflare Workers にデプロイ |
| `bun run typecheck` | `tsc --noEmit` |

## status

MVP として「Inertia + Remix 級」まで完成。詳細な phase 進捗と次の宿題（Streaming SSR / 自前 hydrate 等）は [docs/roadmap.md](docs/roadmap.md) 参照。
