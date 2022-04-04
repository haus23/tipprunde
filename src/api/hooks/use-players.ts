import { useRecoilState } from 'recoil';
import { createWithId } from '@/api/model/repository/create-with-id';
import { playersState } from '@/api/state/players';
import { Player } from '@/api/model/player';

export const usePlayers = () => {
  const [players, setPlayers] = useRecoilState(playersState);

  const create = async (player: Player) => {
    player = await createWithId<Player>('players', player);
    setPlayers([...players, player]);
    return player;
  };

  return { players, create };
};
