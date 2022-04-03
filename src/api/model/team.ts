import { BaseModel } from '@/api/model/base/Model';

export interface Team extends BaseModel {
  name: string;
  shortName: string;
}
