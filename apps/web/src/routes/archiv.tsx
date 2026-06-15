import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/archiv")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Archiv</h1>
      </div>
    </div>
  );
}
