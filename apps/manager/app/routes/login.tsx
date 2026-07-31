import { Logo } from "@tipprunde/ui";
import { Link } from "react-router";

// Placeholder — the TOTP flow lands here in the next step.
export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <title>Anmelden · runde.tips</title>
      <div className="text-accent size-12">
        <Logo />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">Anmelden</h1>
      <p className="text-subtle text-sm">Der Login zieht als Nächstes hier ein.</p>
      <Link to="/" className="text-sm underline underline-offset-4">
        Zur Startseite
      </Link>
    </div>
  );
}
