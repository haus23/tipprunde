import { BaseModel } from '@/api/model/base/Model';

export interface Round extends BaseModel {
  nr: number;
  published: boolean;
  completed: boolean;
}
