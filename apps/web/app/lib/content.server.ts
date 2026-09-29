import { readFile, readdir } from "node:fs/promises";
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

// Every HTML comment in content is a private author note — a gap still to
// fill, an idea for later — and is stripped before rendering. Stripping, not
// just relying on comments being invisible: `marked` passes raw HTML through,
// so a kept comment would be readable in the page source.
const AUTHOR_NOTE = /<!--[\s\S]*?-->/g;

function renderMarkdown(markdown: string) {
  return marked.parse(markdown.replace(AUTHOR_NOTE, "").trim());
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
    html: await renderMarkdown(body),
  };
}

export type BlogPostSummary = {
  slug: string;
  title: string;
  date: string;
  championships: string[];
  /** Everything above the `<!-- more -->` marker, rendered — null without one. */
  excerptHtml: string | null;
};

export type BlogPost = BlogPostSummary & { html: string };

// The author decides where the teaser ends, by putting this on a line of its
// own — no automatic "first paragraph", no truncation. The one HTML comment
// that isn't an author note: it is read before notes are stripped, and goes
// with them.
const EXCERPT_MARKER = /^<!--\s*more\s*-->\s*$/m;

// Occasional articles (Regelkunde, Zusatzfragen, …) in `content/blog/`, the
// filename minus `.md` as slug. Not the per-championship comments above —
// those stay on their championship's own overview.
const BLOG_DIR = path.join(CONTENT_DIR, "blog");

async function readPost(slug: string): Promise<BlogPost | null> {
  let raw: string;
  try {
    raw = await readFile(path.join(BLOG_DIR, `${slug}.md`), "utf-8");
  } catch {
    return null;
  }

  const { frontmatter, body } = parseMarkdownFile(raw);
  // Skips a file with no (or empty) title — a placeholder .md left around
  // while drafting. Not an error, just not ready to list.
  if (!frontmatter.title) return null;
  if (frontmatter.draft && process.env.NODE_ENV === "production") return null;

  const [intro, rest] = body.split(EXCERPT_MARKER, 2);

  return {
    slug,
    title: String(frontmatter.title),
    date: String(frontmatter.date ?? ""),
    championships: Array.isArray(frontmatter.championships)
      ? frontmatter.championships.map(String)
      : [],
    excerptHtml: rest === undefined ? null : await renderMarkdown(intro),
    html: await renderMarkdown(body),
  };
}

/** Every published article, newest first. */
export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  let filenames: string[];
  try {
    filenames = await readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    filenames.filter((f) => f.endsWith(".md")).map((f) => readPost(f.slice(0, -3))),
  );

  return posts
    .filter((p): p is BlogPost => p !== null)
    .map(({ html: _html, ...summary }) => summary)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** One article by slug, with its rendered body. */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return readPost(slug);
}
