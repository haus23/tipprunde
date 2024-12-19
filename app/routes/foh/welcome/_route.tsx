import { redirect } from 'react-router';

import { Card, CardBody, CardHeader } from '#/components/ui/card/card';
import { Divider } from '#/components/ui/divider/divider';

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
    <Card className="mx-2 mt-4 wide:mt-8 small:mx-4">
      <CardHeader>
        <h1 className="font-medium text-3xl">Haus 23 Tipprunde</h1>
      </CardHeader>
      <Divider />
      <CardBody className="grid gap-y-4 text-xl">
        <p>Willkommen bei unserer kleinen Fussball-Tipprunde!</p>
        <p>
          Leider gibt es noch keine Turniere und nichts zu tippen. Wir warten
          einfach auf die erste Runde, die von der Spielleitung freigeschaltet
          wird. Bis dahin empfehle ich ein kühles Blondes am Lieblingstresen
          deiner Stadt.
        </p>
      </CardBody>
    </Card>
  );
}
