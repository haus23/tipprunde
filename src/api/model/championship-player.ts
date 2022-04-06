import { BaseModel } from '@/api/model/base/Model';

export interface ChampionshipPlayer extends BaseModel {
  playerId: string;
  points: number;
  extraPoints: number;
  totalPoints: number;
  rank: number;
}
