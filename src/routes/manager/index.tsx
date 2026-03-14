import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchRulesets } from "@/lib/rulesets.ts";
import { fetchTurniere } from "@/lib/championships.ts";

export const Route = createFileRoute("/manager/")({
  head: () => ({
    meta: [{ title: "Dashboard | Manager" }],
  }),
  loader: async () => {
    const [regelwerke, turniere] = await Promise.all([
      fetchRulesets(),
      fetchTurniere(),
    ]);
    return { hasRegelwerke: regelwerke.length > 0, hasTurniere: turniere.length > 0 };
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  const { hasRegelwerke, hasTurniere } = Route.useLoaderData();

  if (!hasRegelwerke) {
    return (
      <div className="bg-surface border-surface rounded-md border p-6">
        <p className="text-lg font-medium">Hallo, schön dass du da bist!</p>
        <p className="text-subtle mt-3 text-sm">
          Starte deine erste Tipprunde — dein erstes Tippturnier wartet schon auf dich.
        </p>
        <p className="text-subtle mt-2 text-sm">
          Bevor es losgeht, brauchen wir ein Regelwerk: es legt fest, wie Punkte vergeben
          werden, ob es Joker gibt und was sonst noch bei deinem Turnier gelten soll.
        </p>
        <Link
          to="/manager/stammdaten/regelwerke"
          className="text-btn bg-btn data-hovered:bg-btn-hovered data-pressed:bg-btn-pressed mt-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
        >
          Hier geht's lang →
        </Link>
      </div>
    );
  }

  // hasTurniere: redirect to current championship once $slug routes exist.
  return null;
}
