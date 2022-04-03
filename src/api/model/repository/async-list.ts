import {
  collection,
  getDocs,
  query,
  QueryConstraint,
} from 'firebase/firestore';

import { db } from '@/api/firebase/db';
import { converter } from './converter';
import { BaseModel } from '@/api/model/base/Model';

export const asyncList = async <T extends BaseModel>(
  path: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> => {
  const q = query(collection(db, path), ...constraints).withConverter(
    converter<T>()
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
};
