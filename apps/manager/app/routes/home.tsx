import { userContext } from "../lib/context";
import type { Route } from "./+types/home";

export function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Manager</h1>
      <p className="text-lg">
        Angemeldet als <span className="font-medium">{user.name}</span>
      </p>
    </div>
  );
}
