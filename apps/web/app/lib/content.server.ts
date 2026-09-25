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

export type BlogPostSummary = {
  slug: string;
  /** "turniere" = a championship's own comment, slug = championship slug. */
  source: "blog" | "turniere";
  title: string;
  date: string;
  championships: string[];
};

export type BlogPost = BlogPostSummary & { html: string };

function parseBlogFrontmatter(
  frontmatter: Record<string, unknown>,
): Omit<BlogPostSummary, "slug" | "source"> | null {
  // Skips a file with no (or empty) title — the stub content author habit of
  // leaving a placeholder .md around while drafting, same directory as the
  // real posts. Not an error, just not ready to list.
  if (!frontmatter.title) return null;
  if (frontmatter.draft && process.env.NODE_ENV === "production") return null;

  return {
    title: String(frontmatter.title),
    date: String(frontmatter.date ?? ""),
    championships: Array.isArray(frontmatter.championships)
      ? frontmatter.championships.map(String)
      : [],
  };
}

// The Stadionsenf blog reads two directories as one stream: free posts in
// `blog/`, and the per-championship comments in `turniere/` — the same
// articles `getTurnierComment` shows on a championship's own overview. A
// turnier comment is implicitly about its own championship (the filename is
// the slug), so it gets that one as `championships` without needing the field.
const SOURCES = ["blog", "turniere"] as const satisfies BlogPostSummary["source"][];
type Source = BlogPostSummary["source"];

async function readPost(source: Source, slug: string): Promise<BlogPost | null> {
  let raw: string;
  try {
    raw = await readFile(path.join(CONTENT_DIR, source, `${slug}.md`), "utf-8");
  } catch {
    return null;
  }

  const { frontmatter, body } = parseMarkdownFile(raw);
  const parsed = parseBlogFrontmatter(frontmatter);
  if (!parsed) return null;

  return {
    slug,
    source,
    ...parsed,
    championships: source === "turniere" ? [slug] : parsed.championships,
    html: await marked.parse(body.trim()),
  };
}

async function listSlugs(source: Source): Promise<string[]> {
  try {
    const filenames = await readdir(path.join(CONTENT_DIR, source));
    return filenames.filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
  } catch {
    return [];
  }
}

/**
 * Every Stadionsenf article — blog posts and turnier comments alike —
 * newest first. Turnier comments come back regardless of whether their
 * championship is published; the caller filters, since that needs the DB.
 */
export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  const posts = await Promise.all(
    SOURCES.flatMap(async (source) => {
      const slugs = await listSlugs(source);
      return Promise.all(slugs.map((slug) => readPost(source, slug)));
    }),
  );

  return posts
    .flat()
    .filter((p): p is BlogPost => p !== null)
    .map(({ html: _html, ...summary }) => summary)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * One Stadionsenf article by slug. Blog posts and turnier comments share the
 * `/stadionsenf/:slug` namespace, so a blog filename must never equal a
 * championship slug — blog wins if it ever does.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return (await readPost("blog", slug)) ?? (await readPost("turniere", slug));
}
