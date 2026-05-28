import { Card, CardContent } from "../components/card";
import { userContext } from "../lib/context";
import type { Route } from "./+types/home";

export function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Card>
        <CardContent>
          <h1 className="text-4xl font-bold">Manager</h1>
          <p className="mt-2 text-lg">
            Angemeldet als <span className="font-medium">{user.name}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
