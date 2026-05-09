# honox-frame

HonoX 上に乗せる **client navigation + state delivery** の extension layer。Hono ecosystem の旗艦 backend-first FW を狙う実験プロジェクト（仮名 `honox-frame`、後で改名する可能性あり）。

## ざっくり一言で

> HonoX（MPA + islands）に SPA navigation を被せて、Inertia 的な envelope 柔軟性まで載せた FW。
> "Hotwire でも Inertia でもない第3の選択肢"。

## Stack

- **Hono** 4.12.18 — backend core
- **HonoX** 0.1.55 — foundation（fork せず dependency として使う）
- **hono/jsx/dom** — client runtime（React 不採用、~5kb）
- **Vite** 8 — build tool
- **Bun** — package manager（和田さん alignment）
- **Cloudflare Workers** — primary deploy target
- **Tailwind CSS v4** — styling

## Position

| FW | wire format | DX | 方向性 |
|---|---|---|---|
| Hotwire | HTML only | Stimulus（軽量） | Rails 進化 |
| Inertia | JSON only | React/Vue（リッチ） | SPA 起点 |
| **honox-frame** | HTML + JSON + Frame の 3-mode | hono/jsx/dom（リッチ） | HonoX 進化 |

詳しい思想と決定経緯は [docs/roadmap.md](./docs/roadmap.md) 参照。

## Project Structure

```
honox-frame/
├── app/                    ← HonoX 既定の app
│   ├── routes/             ← file-based routing
│   ├── islands/            ← interactive components
│   ├── client.ts           ← HonoX client entry
│   ├── server.ts           ← HonoX server entry
│   └── style.css
├── src/lib/                ← honox-frame 独自 runtime（Phase 0 から実装する）
│   ├── client/             ← link/form intercept、frame swap、islands re-hydrate
│   └── server/             ← <Frame> component、envelope 切替 render primitive
├── docs/                   ← 設計ドキュメント
└── public/
```

PoC が固まったら `src/lib/` を別 package（`@xxx/honox-frame`）に extract して publish する。

## 現在の Phase

**Phase 0 開始前**（scaffold 完了、runtime 未実装）。

Phase 0 入る前に decide すべき設計 question は [docs/roadmap.md の「残る決め事」](./docs/roadmap.md#残る決め事) 参照。

## 開発フロー

```bash
bun install        # 依存解決
bun run dev        # dev server 起動（http://localhost:5173）
bun run build      # production build
bun run deploy     # Cloudflare Workers にデプロイ
```

## 設計の要点（Claude が work 前に押さえる必要がある）

### HonoX を fork しない
HonoX は `node_modules` の dependency として使う。HonoX 本体には手を入れない（upstream 改善が無料で乗る、後方互換、maintenance burden 回避）。HonoX 内部に hook が必要な場合は、本体を modify せず HonoX に PR を出す方向で考える。

### React は使わない
React 不採用。client runtime は **hono/jsx/dom** を使う。理由：bundle size、Hono ecosystem 純度、和田さん alignment、islands architecture では React ecosystem 依存が小さい。

### Flight protocol は不採用
React Server Components の Flight 形式は使わない。wire format は HTML + JSON + Frame の 3-mode envelope（[docs/roadmap.md の Phase 3](./docs/roadmap.md#phase-3-htmljson-envelope-切替) 参照）。

### 段階的実装
一気に scaffold せず、Phase 単位で MVP を積み上げる。各 Phase で「動く状態」を保つ。Phase 0-2 で「実用 FW threshold」、Phase 3 で「独自 FW threshold」。

## 参照

- 設計の single source of truth: [docs/roadmap.md](./docs/roadmap.md)
- 思想と決定経緯（外部）: `~/.claude/projects/-Users-a-kawanobe-brain/memory/project_backend_first_fw.md`
- 関連 brain doc: `~/brain/docs/backend-first FW フェーズ計画.md`、`~/brain/docs/Hono × Inertia 言語化メモ.md`
