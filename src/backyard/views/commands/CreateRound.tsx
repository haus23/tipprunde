import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRounds } from '@/api/hooks/use-rounds';
import { useCurrentChampionship } from '@/backyard/hooks/use-current-championship';

import Button from '@/ui/atoms/Button';
import FormPanel from '@/ui/FormPanel';
import ContentPanel from '@/backyard/components/ContentPanel';
import { useNotify } from '@/core/hooks/use-notify';

function CreateRound() {
  const navigate = useNavigate();
  const { championship } = useCurrentChampionship();
  const { rounds, create } = useRounds(championship?.id);
  const notify = useNotify();

  const nextNr = useRef(rounds.length + 1);

  const createRound = async () => {
    await notify(
      create({
        id: `round-${nextNr.current}`,
        nr: nextNr.current,
        published: false,
        completed: false,
      }),
      `Runde ${nextNr.current} angelegt.`
    );
    navigate('..');
  };

  return (
    <ContentPanel title={'Neue Runde '}>
      <div className="flex items-center gap-x-8 pb-4">
        <FormPanel className="flex max-w-2xl items-center justify-between">
          <h2 className="text-lg font-semibold">Neue Runde {nextNr.current}</h2>
          <Button primary onClick={createRound}>
            Anlegen
          </Button>
        </FormPanel>
      </div>
    </ContentPanel>
  );
}

export default CreateRound;
