import { redirect } from "react-router";
import { logout } from "~/lib/auth/auth.server";
import type { Route } from "./+types/logout";

export async function loader() {
  throw redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  return await logout(request);
}
