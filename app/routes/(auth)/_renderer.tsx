import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { withHonoxFrame } from "../../../src/lib/server/render";
import Toast from "../../islands/toast";

const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body>
        {children}
        <Toast />
      </body>
    </html>
  );
});

export default withHonoxFrame(renderer);
