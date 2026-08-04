import { Link } from "react-router";

// Placeholder — the dashboard lands here once the public routes are ported.
export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 py-24 text-center">
      <title>runde.tips</title>
      <h1 className="text-2xl font-semibold tracking-tight">runde.tips</h1>
      <p className="text-subtle text-base">Der neue Auftritt entsteht gerade an dieser Stelle.</p>
      <Link to="/manager" className="text-accent text-sm hover:underline">
        Zum Manager
      </Link>
    </div>
  );
}
