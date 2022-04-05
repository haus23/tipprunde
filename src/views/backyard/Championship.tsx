import BackyardContent from '@/layouts/components/BackyardContent';
import { useCurrentChampionship } from '@/views/backyard/hooks/use-current-championship';
import FormPanel from '@/components/FormPanel';
import { useMemo, useState } from 'react';
import CheckboxSwitch from '@/components/atoms/CheckboxSwitch';
import { usePlayers } from '@/api/hooks/use-players';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/outline';
import Button from '@/components/atoms/Button';
import { useChampionshipPlayers } from '@/api/hooks/use-championship-players';
import ModalDialog from '@/components/ModalDialog';
import PlayerForm from '@/components/forms/PlayerForm';
import { Player } from '@/api/model/player';

export default function Championship() {
  const [isPlayerDlgOpen, setPlayerDlgOpen] = useState(false);

  const { championship } = useCurrentChampionship();
  const { players, create } = usePlayers();
  const { championshipPlayers, addPlayer, removePlayer } =
    useChampionshipPlayers(championship?.id);

  const remainingPlayers = useMemo(
    () =>
      players.filter(
        (p) =>
          championshipPlayers.findIndex((cp) => cp.playerId === p.id) === -1
      ),
    [players, championshipPlayers]
  );

  const [published, setPublished] = useState(championship?.published ?? false);
  const [completed, setCompleted] = useState(championship?.completed ?? false);

  const addToChampionship = (playerId: string) => addPlayer(playerId);
  const removeFromChampionship = (playerId: string) => removePlayer(playerId);
  const createNewPlayer = async (player: Player) => {
    player = await create(player);
    addPlayer(player.id);
  };

  return (
    championship !== null && (
      <BackyardContent title="Aktuelles Turnier">
        <FormPanel>
          <h2 className="text-xl font-semibold py-2">{championship.title}</h2>
          <hr className="border-gray-300 dark:border-gray-600" />
          <div className="flex flex-col gap-y-4 mt-4">
            <CheckboxSwitch
              checked={published}
              onChange={(ev) => setPublished(ev.target.checked)}
              label="Veröffentlicht"
            />
            <CheckboxSwitch
              checked={completed}
              onChange={(ev) => setCompleted(ev.target.checked)}
              label="Abgeschlossen"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pb-4 border-b border-gray-300 dark:border-gray-600">
            <h3 className="text-lg text-center font-semibold py-2">
              Spielerliste bearbeiten
            </h3>
            <Button
              onClick={() => setPlayerDlgOpen(true)}
              primary
              className="py-2"
            >
              Neuer Spieler
            </Button>
          </div>
          <div className="flex mt-4 gap-x-2 sm:gap-x-4 divide-x divide-gray-300 dark:divide-gray-500">
            <div className="basis-1/2">
              <h4 className="font-medium text-center">Mitspieler</h4>
              <div className="h-full w-full overflow-y-auto">
                <ul
                  role="list"
                  className="mt-2 relative z-0 divide-y divide-gray-200 dark:divide-gray-600"
                >
                  {championshipPlayers.map((p) => (
                    <li
                      className="flex items-center justify-between px-2 sm:px-4 py-2 select-none"
                      key={p.id}
                    >
                      <span className="mr-4">{p.player.name}</span>
                      <button
                        onClick={() => removeFromChampionship(p.playerId)}
                      >
                        <ChevronDoubleRightIcon className="h-6 w-6 p-1 hover:ring-2 hover:ring-gray-500 rounded-full" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="basis-1/2 pl-2 sm:pl-4">
              <h4 className="font-medium text-center">Alle Spieler</h4>
              <div className="h-full w-full overflow-y-auto">
                <ul
                  role="list"
                  className="mt-2 relative z-0 divide-y divide-gray-200 dark:divide-gray-600"
                >
                  {remainingPlayers.map((p) => (
                    <li
                      className="flex items-center px-2 sm:px-4 py-2 select-none"
                      key={p.id}
                    >
                      <button onClick={() => addToChampionship(p.id)}>
                        <ChevronDoubleLeftIcon className="h-6 w-6 p-1 hover:ring-2 hover:ring-gray-500 rounded-full" />
                      </button>
                      <span className="ml-4">{p.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FormPanel>
        <ModalDialog
          title="Neuer Spieler"
          open={isPlayerDlgOpen}
          onClose={() => setPlayerDlgOpen(false)}
        >
          <PlayerForm
            onDone={() => setPlayerDlgOpen(false)}
            onCreated={createNewPlayer}
          />
        </ModalDialog>
      </BackyardContent>
    )
  );
}
