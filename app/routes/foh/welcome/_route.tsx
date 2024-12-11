import { Separator } from 'react-aria-components';
import { redirect } from 'react-router';

import { getPublishedChampionships } from '#/utils/app/championships.server';

export const meta = [
  { title: 'runde.tips' },
  {
    name: 'description',
    content: 'Haus23 Tipprunde',
  },
];

export async function loader() {
  const championships = await getPublishedChampionships();

  if (championships.length > 0) {
    throw redirect('/');
  }
  return null;
}

export default function WelcomeRoute() {
  return (
    <article className="mx-2 mt-4 wide:mt-8 rounded-sm bg-white shadow-md ring-1 ring-grey-6 small:mx-0 dark:bg-grey-2">
      <header className="p-4 wide:px-6">
        <h1 className="font-medium text-3xl">Haus 23 Tipprunde</h1>
      </header>
      <Separator className="border-grey-6" />
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
