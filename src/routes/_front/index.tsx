import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_front/")({
  head: () => ({
    meta: [
      { title: "runde.tips" },
      { name: "description", content: "Haus23 Fussball Tipprunde" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
      <p className="text-xs uppercase tracking-widest text-subtle">Haus23</p>
      <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
      <p className="mt-1 text-sm text-subtle">Tabelle und aktuelle Spiele folgen hier.</p>
    </div>
  );
}
