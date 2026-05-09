import { createElement } from "hono/jsx";
import { useEffect, useState } from "hono/jsx";

export type PageData = {
  component: string;
  props: Record<string, unknown>;
  url?: string;
  title?: string;
  partial?: string[];
};

type PageLoader = (name: string) => Promise<unknown>;

let pageLoader: PageLoader | null = null;
let exposedSetPage: ((data: PageData) => Promise<void> | void) | null = null;

export function setPageLoader(loader: PageLoader): void {
  pageLoader = loader;
}

export async function loadPageComponent(name: string): Promise<unknown> {
  if (!pageLoader) return null;
  return pageLoader(name);
}

export async function setPage(data: PageData): Promise<void> {
  if (!exposedSetPage) {
    console.warn("[honox-frame] App not mounted; cannot setPage");
    return;
  }
  await exposedSetPage(data);
}

type AppState = { page: PageData; Component: unknown };

export function HonoxFrameApp({ initial }: { initial: AppState }) {
  const [state, setState] = useState<AppState>(initial);

  useEffect(() => {
    exposedSetPage = async (next) => {
      const isPartial = !!next.partial && next.partial.length > 0;

      if (isPartial) {
        let merged = false;
        setState((prev) => {
          if (next.component !== prev.page.component) return prev;
          merged = true;
          return {
            page: { ...next, props: { ...prev.page.props, ...next.props } },
            Component: prev.Component,
          };
        });
        if (merged) return;
        // partial だが component 不一致 → full reload にフォールバック
        console.warn(
          "[honox-frame] partial response component mismatch; falling back to full",
        );
      }

      const Component = await loadPageComponent(next.component);
      if (!Component) {
        console.warn(
          `[honox-frame] page component not found: ${next.component}`,
        );
        return;
      }
      setState({ page: next, Component });
    };
    return () => {
      exposedSetPage = null;
    };
  }, []);

  const Component = state.Component as (props: unknown) => unknown;
  return createElement(Component, state.page.props);
}
