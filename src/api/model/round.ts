import { BaseModel } from './base';

export interface Round extends BaseModel {
  nr: number;
  published: boolean;
  completed: boolean;
}
