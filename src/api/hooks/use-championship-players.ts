import { useRecoilState } from 'recoil';
import { championshipPlayersState } from '@/api/state/championship-players';
import { usePlayers } from '@/api/hooks/use-players';
import { useMemo } from 'react';
import { Player } from '@/api/model/player';
import { Rank } from '../model/rank';
import { createWithId } from '@/api/model/repository/create-with-id';
import { ChampionshipPlayer } from '@/api/model/championship-player';
import { remove } from '@/api/model/repository/remove';

export const useChampionshipPlayers = (championshipId?: string) => {
  const [championshipPlayersInternal, setChampionshipPlayers] = useRecoilState(
    championshipPlayersState(championshipId ?? '')
  );
  const { players } = usePlayers();

  const championshipPlayers = useMemo(
    () =>
      championshipPlayersInternal.map(
        (cp) =>
          ({
            ...cp,
            player: players.find((p) => p.id === cp.playerId) as Player,
          } as Rank)
      ),
    [championshipPlayersInternal, players]
  );

  const addPlayer = async (playerId: string) => {
    const championshipPlayer: ChampionshipPlayer = {
      playerId: playerId,
      id: '',
    };
    await createWithId<ChampionshipPlayer>(
      `championships/${championshipId}/players`,
      championshipPlayer
    );
    setChampionshipPlayers([...championshipPlayers, championshipPlayer]);
    return championshipPlayer;
  };

  const removePlayer = async (playerId: string) => {
    const championshipPlayer = championshipPlayers.find(
      (cp) => cp.playerId === playerId
    ) as ChampionshipPlayer;
    await remove(`championships/${championshipId}/players`, championshipPlayer);
    setChampionshipPlayers(
      championshipPlayers.filter((cp) => cp !== championshipPlayer)
    );
  };

  return { championshipPlayers, addPlayer, removePlayer };
};
