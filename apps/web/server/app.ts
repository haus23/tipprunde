import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";

import { createRequestListener } from "@remix-run/node-fetch-server";
import compressionMiddleware from "compression";
import { createRequestHandler, RouterContextProvider } from "react-router";
import sirv from "sirv";

type NodeMiddleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => void;

// Railway target — replaces the Cloudflare Workers `workers/app.ts` entry.
// Deliberately a small hand-rolled server, not `@react-router/serve`: chat v2
// needs raw access to the HTTP server to attach SSE/WS, so this is built once
// rather than swapped twice. See docs/decisions/02-hosting-railway.md.

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

// Built here rather than with `@react-router/node`'s wrapper, which is the
// same three lines but passes no listener options — and `trustProxy` is the
// one we need. Without it the request URL takes its protocol from the socket,
// which behind Railway's TLS-terminating proxy is plain http. React Router
// then compares that against the browser's `Origin: https://…`, reads the
// mismatch as a CSRF attempt and answers every action with 400. Railway
// overwrites the `X-Forwarded-*` headers, so trusting them is sound; locally
// nothing sends them and the behaviour is unchanged.
const requestHandler = createRequestHandler(build, process.env.NODE_ENV);

const handleRequest = createRequestListener(
  (request) => requestHandler(request, new RouterContextProvider()),
  { trustProxy: true },
);

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
