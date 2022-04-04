import { BaseModel } from '@/api/model/base/Model';

export interface Player extends BaseModel {
  name: string;
  email: string;
}
