import { readFile } from "node:fs/promises";
import path from "node:path";

import { marked } from "marked";
import { parse as parseYaml } from "yaml";

// `content/` sits beside `app/`, not inside it, so it survives the Vite
// bundle unchanged — reading it at request time (not at build time) means a
// new comment only needs a deploy, never a rebuild-and-redeploy-twice dance.
// Resolved via `process.cwd()`, not `import.meta.dirname`: this file gets
// bundled into `dist/server` for production, where its own location no
// longer matches the source tree, but `pnpm dev`/`pnpm start` always run
// with the package root (`apps/web`) as cwd — see `server/app.ts` for the
// opposite tradeoff, where the *unbundled* entry file can trust its own
// location instead.
const CONTENT_DIR = path.join(process.cwd(), "content");

export type TurnierComment = {
  title: string;
  date: string;
  html: string;
};

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

function parseMarkdownFile(raw: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = FRONTMATTER_PATTERN.exec(raw);
  if (!match) return { frontmatter: {}, body: raw };
  const [, frontmatterBlock, body] = match;
  return { frontmatter: parseYaml(frontmatterBlock) ?? {}, body };
}

/**
 * Reads the "Stadionsenf" comment for one championship, if it exists —
 * `content/turniere/<slug>.md`. The filename *is* the championship slug, on
 * purpose: one comment per tournament, structurally (two files can't share a
 * name), with a lookup that never has to scan the directory. No
 * `championships` frontmatter field, for the same reason — it would just be
 * a second place for the same fact to drift out of sync with the first.
 */
export async function getTurnierComment(slug: string): Promise<TurnierComment | null> {
  let raw: string;
  try {
    raw = await readFile(path.join(CONTENT_DIR, "turniere", `${slug}.md`), "utf-8");
  } catch {
    return null;
  }

  const { frontmatter, body } = parseMarkdownFile(raw);
  if (frontmatter.draft && process.env.NODE_ENV === "production") return null;

  return {
    title: String(frontmatter.title ?? ""),
    date: String(frontmatter.date ?? ""),
    html: await marked.parse(body.trim()),
  };
}
