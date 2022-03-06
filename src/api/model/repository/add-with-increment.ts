import { db } from '@/api/firebase/db';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BaseModel } from '../base';
import { Sequence } from '../sequence';
import { add } from './add';
import { converter } from './converter';

export const addWithIncrement = async <T extends BaseModel>(
  path: string,
  sequenceName: string,
  entity: T
) => {
  const sequenceRef = doc(db, `sequences/${sequenceName}`).withConverter(
    converter<Sequence>()
  );
  const snapshot = await getDoc(sequenceRef);
  let sequence: Sequence;
  if (snapshot.exists()) {
    sequence = snapshot.data();
  } else {
    sequence = { id: sequenceName, sequence: 0 };
  }
  ++sequence.sequence;
  await setDoc(sequenceRef, sequence);

  entity.id = sequence.sequence.toString();

  return add(path, entity);
};
