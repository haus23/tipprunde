import { ChampionshipPlayer } from '@/api/model/championship-player';
import { Player } from '@/api/model/player';

export interface Rank extends ChampionshipPlayer {
  player: Player;
}
