export function loader(): never {
  throw new Error("Deliberate test error — error boundary check");
}

export default function Zusatzpunkte() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Zusatzpunkte</h1>
    </div>
  );
}
