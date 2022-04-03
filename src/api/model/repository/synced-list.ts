import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from 'firebase/firestore';

import { db } from '@/api/firebase/db';
import { converter } from '@/api/model/repository/converter';

export const syncedList = <T>(
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
