import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";

import { createRequestListener } from "@react-router/node";
import compressionMiddleware from "compression";
import { RouterContextProvider } from "react-router";
import sirv from "sirv";

type NodeMiddleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => void;

// Railway target — replaces the Cloudflare Workers `workers/app.ts` entry.
// Deliberately a small hand-rolled server, not `@react-router/serve`: chat v2
// needs raw access to the HTTP server to attach SSE/WS, so this is built once
// rather than swapped twice. See docs/railway-plan.md.

const PORT = Number(process.env.PORT) || 3000;

// Resolved from this file's own location, not process.cwd() — correct
// regardless of where the process is launched from.
const dir = import.meta.dirname;
const BUILD_PATH = path.join(dir, "../dist/server/index.js");
const CLIENT_ASSETS_PATH = path.join(dir, "../dist/client");

const build = await import(BUILD_PATH);

// Everything under dist/client is Vite-content-hashed (no public/ dir in this
// app), so a one-year immutable cache is always safe.
const serveAssets = sirv(CLIENT_ASSETS_PATH, {
  etag: true,
  maxAge: 31536000,
  immutable: true,
});

const handleRequest = createRequestListener({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: () => new RouterContextProvider(),
});

// @types/compression assumes an Express req/res; the middleware itself only
// touches plain Node http properties at runtime, so this is a types-only cast.
const gzip = compressionMiddleware() as unknown as NodeMiddleware;

const server = createServer((req, res) => {
  gzip(req, res, () => {
    serveAssets(req, res, () => {
      handleRequest(req, res);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
