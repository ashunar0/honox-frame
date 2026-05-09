# honox-frame Roadmap

実装の段階計画。一気に scaffold せず、Phase 単位で動く MVP を積み上げる。

> 思想と決定経緯の詳細は [`~/brain/docs/backend-first FW フェーズ計画.md`](../../../../brain/docs/backend-first%20FW%20フェーズ計画.md)（同期元、master copy）。
> このファイルは project-local copy として「コード書くときに参照する」用途。

## Position

| FW | wire format | DX | 方向性 |
|---|---|---|---|
| Hotwire | HTML only | Stimulus（軽量） | Rails 進化 |
| Inertia | JSON only | React/Vue（リッチ） | SPA 起点 |
| **honox-frame** | HTML + JSON + Frame の 3-mode | hono/jsx/dom（リッチ） | HonoX 進化 |

つまり **Hono+Inertia 系（state delivery + persistent layout + SPA nav）** と **HonoX 系（SSR + islands + bundle 最適化）** の合流点。

### 採用 stack
- **Hono** — backend core
- **HonoX** — foundation（fork せず dependency として使う）
- **hono/jsx/dom** — client runtime（React じゃない、~5kb）
- **wire** — HTML / JSON / Frame の 3-mode envelope

### 採用しない理由が明確なもの
- React → bundle 肥大、Hono 純度損なう、ecosystem 依存
- Solid → 学習コスト、Hono ecosystem 外
- Flight protocol → 攻撃面、複雑性、VDOM 制約に縛られる

---

## Phase Overview

```
Phase 0-2: 「動く Web app を作る」段階
  ├─ Phase 0: 部分更新 navigation
  ├─ Phase 1: islands re-hydrate（インタラクティブ復活）
  └─ Phase 2: 標準 form 対応（実用 FW threshold）

Phase 3+: 「Inertia 思想を取り込んで効率化」段階
  ├─ Phase 3: HTML/JSON envelope 柔軟切替（独自性 threshold）
  ├─ Phase 4: partial reload（特定 props だけ refetch）
  └─ Phase 5: streaming SSR（段階表示）
```

| 達成 phase | 状態 |
|---|---|
| Phase 2 まで | "Hotwire + islands" のクローン的なもの |
| Phase 3 まで | Inertia の envelope 柔軟性が加わる → **独自 position 立つ** |
| Phase 4 まで | Inertia の partial reload も吸収 |
| Phase 5 まで | UX 拡張 |

---

## Phase 0: persistent layout + frame swap

**やること**: HTML の一部分だけ差し替える client navigation runtime を実装する。

**動作仕様**:
1. `<a href="/users">Users</a>` の click を JS が intercept
2. fetch して新しい HTML を取得
3. `<Frame id="page">` の中身だけ DOM swap
4. Sidebar など Frame 外は触らない

**実装範囲**:
- `<Frame id="...">` server component（marker として）
- link intercept runtime（30 行くらい）
- frame swap utility
- history API での URL 同期

**この段階でできないこと**:
- island 内の interactivity（HTML は差し替わるけど JS が死んでる、ハリボテ状態）
- form submit
- mutation

---

## Phase 1: islands re-hydrate

**やること**: Phase 0 で frame 差し替えた後、新 DOM の islands を hydrate して interactivity 復活。

**動作仕様**:
1. frame swap 完了
2. 新 DOM を walk して `<hono-island>` marker を検出
3. `import('/_islands/Counter.abc123.js')` で動的 import（cache hit なければ fetch）
4. props を marker から復元
5. `hydrate(el, Component, props)` で再 hydration

**実装範囲**:
- island marker 検出 logic
- 動的 import + hydrate orchestration
- islands manifest との連携（HonoX の Vite plugin が出力してる）

**この段階で達成**:
- 「ちゃんと動く SPA 体験」が完成
- 各 island は独立して interactive
- ただしまだ「読み取り専用」の世界

---

## Phase 2: 標準 form 対応 + mutation

**やること**: `<form action method>` を auto-intercept して mutation flow を実現。

**設計思想**: HTML の semantics を裏切らずに SPA 体験を組む。React 流（useState + onClick）じゃなくて、HTML として正しい書き方をすると自動で SPA になる方向。

**動作仕様**:
1. `<form action="/users" method="POST">` の submit を runtime が intercept
2. POST 送信
3. サーバーが DB 更新後、新しい page HTML を返す
4. frame swap + islands re-hydrate
5. 「server-rendered な部分」も含めて画面更新

**実装範囲**:
- form intercept runtime
- Method override（HTML は GET/POST native 対応のみ、PUT/DELETE は `_method=PUT` workaround）
- Validation error handling（422 レスポンス → form にエラー表示）
- Redirect 対応（302 レスポンス → client が follow）
- Progressive enhancement（JS 無効でも full reload で動く）

**この段階で達成**:
- **Hotwire + islands クラスの FW 完成**
- CRUD アプリが書ける
- 普通の Web app の最低限機能

---

## Phase 3: HTML/JSON envelope 切替

**やること**: 同じ endpoint で HTML or JSON を選択できるようにする。

**動作仕様**:

| Mode | response | 用途 |
|---|---|---|
| `X-FW-Mode: html` | full ページ HTML | 初回ロード、SEO |
| `X-FW-Mode: json` | `{ component, props }` JSON | SPA nav、optimistic |
| `X-FW-Mode: frame` | frame 内 HTML だけ | Phase 0-2 の挙動 |

**サーバー側 API**:
```tsx
app.get('/users', async (c) => {
  const users = await db.users.list()
  return c.render(<UsersPage users={users} />, {
    envelope: c.req.header('X-FW-Mode') ?? 'html'
  })
})
```

**有効なシナリオ**:
- Optimistic update（送信前 UI 更新、JSON で結果取得して同期）
- 軽量 navigation（HTML parse せず props だけ更新）
- 普通の form submit（Frame mode のまま）

**この段階で達成**:
- **独自 FW threshold 突破**
- "Hono+Inertia 系 と HonoX 系 の合流点" の position が visible に
- ここから "honox-frame" として独立した identity を持てる

---

## Phase 4: partial reload

**やること**: 特定の props だけ refetch する optimization。

**動作仕様**:
```js
router.reload({ only: ['users'] })  // users prop だけ refetch
```

サーバーは `X-FW-Partial-Data` header を見て、指定された props だけ計算して返す。

**この段階で達成**: Inertia の partial reload 機能まで吸収。

---

## Phase 5: streaming SSR

**やること**: Hono JSX の Suspense を使って初回ロード時の段階表示。

**動作仕様**:
- `<Suspense fallback={<Loading />}>` で async component を囲む
- サーバーは fallback HTML を即送信、promise resolve 後に実 HTML を stream
- VDOM ストリーミング不要、HTML ストリーミングだけで成立

**この段階で達成**: UX 上の段階表示が手に入る。React の streaming SSR と同じ体験を、Flight 抜きで。

---

## プロジェクト構造の意図

```
honox-frame/
├── app/                    ← HonoX 既定（手を入れない、HonoX user 通常 flow）
└── src/lib/                ← honox-frame 独自 runtime
    ├── client/
    │   ├── navigate.ts    ← link intercept (Phase 0)
    │   ├── hydrate.ts     ← islands re-hydrate (Phase 1)
    │   └── form.ts        ← form intercept (Phase 2)
    └── server/
        ├── Frame.tsx      ← <Frame> component
        └── render.ts      ← envelope 切替 (Phase 3)
```

`app/client.ts` で runtime を起動：

```ts
import { createClient } from 'honox/client'
import { initNavigation } from '../src/lib/client/navigate'

createClient()        // HonoX の islands hydration
initNavigation()      // honox-frame の navigation runtime
```

PoC 動いたら `src/lib/` を別 package（`@xxx/honox-frame`）に extract して publish。

---

## 残る決め事

### 命名
仮置き：`honox-frame`。PoC 動いてから decide で OK。

候補：
- `honox-frame`（機能直球）
- `honox-bridge`（Hotwire/Inertia bridge 感）
- `honox-flow`（flow 感）
- 全く新しい名前

### Phase 0 入る前に詰めたい設計 question

#### (a) Frame の API 表現
- A1: `<Frame id="page">` JSX component（明示的）
- A2: file convention（`_layout.tsx` 配下が自動的に frame、HonoX の慣習に近い）
- A3: middleware で指定（`c.frame('page', <X />)`）

#### (b) Wire format の choice
- B1: フルページ HTML 返して client が Frame 抽出（Turbo 方式、サーバー側はシンプル）
- B2: Frame 内 HTML だけ返す（最適化、サーバーが frame 知ってる必要）

#### (c) HonoX への侵襲度
- C1: HonoX 公開 API のみ使う（middleware + Vite plugin 追加だけ）
- C2: HonoX に PR 出して必要 hook 追加

これら 3 つを decide してから Phase 0 入る。

---

## 後で再検討する論点

- **signal-as-cache philosophy** と hono/jsx/dom（VDOM, useState）の整合性
  - 旧設計（2026-05-07 brain memory）では signal graph = cache の identity 三位一体を狙ってた
  - hono/jsx/dom 採用で前提が変わるので要再評価
- **2-package 構成の妥当性**：旧 `@xxx/runtime` + `@xxx/hono` 構成が hono/jsx/dom 前提でも妥当か
- **Vidro との非対称性整理**：Vidro = signal 自作、honox-frame = signal なし、の棲み分け

詳細は brain memory `project_backend_first_fw.md` の "残る要再検討論点" 参照。

---

## 関連

- brain doc（master copy）: `~/brain/docs/backend-first FW フェーズ計画.md`
- brain memory（思想と決定経緯）: `~/.claude/projects/-Users-a-kawanobe-brain/memory/project_backend_first_fw.md`
- 関連 brain memory: `project_hono_inertia_contribution.md`、`project_honox_research.md`、`project_post_rsc_experiments.md`
- 関連 brain doc: [[Hono × Inertia 言語化メモ]]、[[@hono-inertia 触ってみた - 記事下書き]]

## 経緯

- [[2026-05-09]] — RSC 批判から逆算、HonoX 進化路線と Inertia 思想合流の整理を経て確定。プロジェクト scaffold 完了。
