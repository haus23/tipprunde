import { db } from '@/api/firebase/db';
import { doc, runTransaction } from 'firebase/firestore';
import { BaseModel } from '../base';
import { Sequence } from '../sequence';
import { converter } from './converter';

export const addWithIncrement = async <T extends BaseModel>(
  path: string,
  sequence: string,
  entity: T
) => {
  const seqRef = doc(db, 'sequences', sequence).withConverter(
    converter<Sequence>()
  );
  let nextId = 1;

  return await runTransaction(db, async (tx) => {
    const seqDoc = await tx.get(seqRef);

    if (seqDoc.exists()) {
      nextId = seqDoc.data().sequence + 1;
      tx.update(seqRef, { sequence: nextId });
    } else {
      tx.set(seqRef, { sequence: nextId });
    }

    entity.id = nextId.toString();
    const entityRef = doc(db, path, entity.id).withConverter(converter<T>());
    tx.set(entityRef, entity);
  });
};
