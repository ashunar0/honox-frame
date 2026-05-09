import { createElement } from "hono/jsx";
import { useEffect, useState } from "hono/jsx";

export type PageData = {
  component: string;
  props: Record<string, unknown>;
  url?: string;
  title?: string;
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
