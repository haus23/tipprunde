import { BaseModel } from '@/api/model/base/Model';

export interface Championship extends BaseModel {
  title: string;
  nr: number;
  published: boolean;
  completed: boolean;
}
