import { atomFamily } from 'recoil';
import { Championship } from '@/api/model/championship';
import { asyncList } from '@/api/model/repository/async-list';
import { ChampionshipPlayer } from '@/api/model/championship-player';

export const championshipPlayersState = atomFamily<
  ChampionshipPlayer[],
  Championship['id']
>({
  key: 'championship-players',
  default: (championshipId) =>
    championshipId === ''
      ? []
      : asyncList<ChampionshipPlayer>(
          `championships/${championshipId}/players`
        ),
});
