import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/api/firebase/db';

import { BaseModel } from '@/api/model/base/Model';
import { Sequence } from '@/api/model/base/sequence';

import { converter } from './converter';

export const createWithAutoId = async <T extends BaseModel>(
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
      tx.set(seqRef, { id: sequence, sequence: nextId });
    }

    entity.id = nextId.toString();
    const entityRef = doc(db, path, entity.id).withConverter(converter<T>());
    tx.set(entityRef, entity);

    return entity;
  });
};
