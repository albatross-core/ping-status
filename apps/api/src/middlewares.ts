import { serveStatic } from "hono/bun";
import { createMiddleware } from "hono/factory";
import { join } from "node:path";

const STATIC_FILE_REGEX =
  /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map)$/;

const publicDir = join(import.meta.dir, "../public");

export const serveWebApp = createMiddleware((c, next) => {
  if (c.req.path.startsWith("/api")) {
    return next();
  }

  if (c.req.path.match(STATIC_FILE_REGEX)) {
    return serveStatic({ root: publicDir })(c, next);
  }

  return serveStatic({ path: "/index.html", root: publicDir })(c, next);
});
