import { Separator } from 'react-aria-components';

export default function WelcomeRoute() {
  return (
    <article className="mx-2 mt-8 rounded-sm bg-grey-2 shadow-sm ring-1 ring-grey-6 small:mx-0">
      <header className="p-4 wide:px-6">
        <h1 className="font-medium text-3xl">Haus 23 Tipprunde</h1>
      </header>
      <Separator />
      <div className="grid gap-y-4 p-4 wide:px-6 text-lg">
        <p>Willkommen bei unserer kleinen Fussball-Tipprunde!</p>
        <p>
          Leider gibt es noch keine Turniere und nichts zu tippen. Wir warten
          einfach auf die erste Runde, die von der Spielleitung freigeschaltet
          wird. Bis dahin empfehle ich ein kühles Blondes am Lieblingstresen
          deiner Stadt.
        </p>
      </div>
    </article>
  );
}
