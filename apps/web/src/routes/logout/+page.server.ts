import { deleteSession } from "$lib/server/db/auth";
import { redirect } from "@sveltejs/kit";

import type { Actions } from "./$types";

export const actions = {
  default: async ({ cookies }) => {
    const sessionId = cookies.get("__auth");
    if (sessionId) await deleteSession(sessionId);
    cookies.delete("__auth", { path: "/" });
    redirect(303, "/");
  },
} satisfies Actions;
