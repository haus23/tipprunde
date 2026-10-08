import { PostList } from "#/components/post-list.tsx";
import { getBlogPosts } from "#/lib/content.server.ts";

import type { Route } from "./+types/index";

export async function loader() {
  return { posts: await getBlogPosts() };
}

export default function NachspielzeitIndex({ loaderData }: Route.ComponentProps) {
  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>Nachspielzeit · runde.tips</title>
      <div className="mb-10 flex flex-col items-center gap-2">
        <h1 className="poster-title poster-title-bar text-4xl">Nachspielzeit</h1>
      </div>

      <div className="xs:px-6 mx-auto max-w-2xl px-4">
        <PostList posts={loaderData.posts} withExcerpts />
      </div>
    </div>
  );
}
