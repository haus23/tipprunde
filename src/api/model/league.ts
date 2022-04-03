import { BaseModel } from '@/api/model/base/Model';

export interface League extends BaseModel {
  name: string;
  shortName: string;
}
