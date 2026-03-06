import { Logo } from "@/components/logo";
import Link from "next/link";

export default function Page() {
  return (
    <main className="relative grid min-h-svh place-items-center">
      <Link className="text-subtle absolute top-4 right-4 hover:text-base" href="/manager">
        Manager
      </Link>
      <div className="flex flex-col items-center landscape:flex-row">
        <div className="size-56">
          <Logo />
        </div>
        <h1 className="text-6xl tracking-wide">runde.tips</h1>
      </div>
    </main>
  );
}
