import { Logo } from "@/components/logo";

export default function Page() {
  return (
    <main className="absolute inset-0 place-self-center">
      <div className="flex flex-col items-center landscape:flex-row">
        <div className="size-56">
          <Logo />
        </div>
        <h1 className="text-6xl tracking-wide">runde.tips</h1>
      </div>
    </main>
  );
}
