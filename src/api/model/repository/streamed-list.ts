import { db } from '@/api/firebase/db';
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from 'firebase/firestore';
import { converter } from './converter';

export const streamedList = <T>(
  onData: (entities: T[]) => void,
  path: string,
  ...constraints: QueryConstraint[]
): (() => void) => {
  const q = query(collection(db, path), ...constraints).withConverter(
    converter<T>()
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const entities = snapshot.docs.map((d) => d.data());
    onData(entities);
  });

  return unsubscribe;
};
