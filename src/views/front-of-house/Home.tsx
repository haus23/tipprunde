import Button from '@/components/atoms/Button';

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4 rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
      <h2 className="px-4 text-3xl font-semibold">Haus23 Tipprunde</h2>
      <hr />
      <div className="px-4 text-lg">
        Hier entsteht unsere neue Tipprunde - also zumindest die
        Online-Auswertung. Bis allerdings erste Tabellenstände tatsächlich hier
        auf Abruf stehen, dauert es noch eine kleine Weile.
        <div className="mt-8 flex flex-col items-center gap-y-4">
          <>
            <Button primary className="w-32">
              Log In
            </Button>
            <div className="text-sm text-gray-500">Nur für interne Zwecke</div>
          </>
        </div>
      </div>
    </div>
  );
}
