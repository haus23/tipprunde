import { Logo } from "@tipprunde/ui";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <title>runde.tips</title>
      <div className="text-accent size-16">
        <Logo />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">runde.tips</h1>
      <p className="text-subtle text-sm">Der neue Auftritt entsteht gerade an dieser Stelle.</p>
      <Link to="/manager" className="text-sm underline underline-offset-4">
        Zum Manager
      </Link>
    </div>
  );
}
