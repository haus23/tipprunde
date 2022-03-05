import { db } from '@/api/firebase/db';
import {
  collection,
  getDocs,
  query,
  QueryConstraint,
} from 'firebase/firestore';
import { converter } from './converter';

export const asyncList = async <T>(
  path: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> => {
  const q = query(collection(db, path), ...constraints).withConverter(
    converter<T>()
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
};
