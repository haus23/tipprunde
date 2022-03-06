import { BaseModel } from '@/api/model/base';

export interface League extends BaseModel {
  name: string;
  slug: string;
  short_name: string;
}
