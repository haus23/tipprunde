import { BaseModel } from './base';

export interface Championship extends BaseModel {
  title: string;
  nr: number;
  published: boolean;
  completed: boolean;
}
