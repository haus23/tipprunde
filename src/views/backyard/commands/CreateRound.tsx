import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRounds } from '@/api/hooks/use-rounds';
import { useCurrentChampionship } from '@/views/backyard/hooks/use-current-championship';
import BackyardContent from '@/layouts/components/BackyardContent';
import FormPanel from '@/components/FormPanel';
import Button from '@/components/atoms/Button';

export default function CreateRound() {
  const navigate = useNavigate();
  const { championship } = useCurrentChampionship();
  const { rounds, create } = useRounds(championship?.id);

  const nextNr = useRef(rounds.length + 1);

  const createRound = async () => {
    await create({
      id: `round-${nextNr.current}`,
      nr: nextNr.current,
      published: false,
      completed: false,
    });
    navigate('..');
  };

  return (
    <BackyardContent title={'Neue Runde '}>
      <div className="flex items-center gap-x-8 pb-4">
        <FormPanel className="flex max-w-2xl items-center justify-between">
          <h2 className="text-lg font-semibold">Neue Runde {nextNr.current}</h2>
          <Button primary onClick={createRound}>
            Anlegen
          </Button>
        </FormPanel>
      </div>
    </BackyardContent>
  );
}
