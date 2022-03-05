import { collection, doc, DocumentReference, setDoc } from 'firebase/firestore';
import { db } from '@/api/firebase/db';
import { BaseModel } from '../base';
import { converter } from './converter';

export const add = async <T extends BaseModel>(path: string, entity: T) => {
  let docRef: DocumentReference<T>;
  if (entity.id) {
    docRef = doc(db, path, entity.id.toString()).withConverter(converter<T>());
    await setDoc(docRef, entity);
  } else {
    docRef = doc(collection(db, path)).withConverter(converter<T>());
    await setDoc(docRef, entity);
    entity.id = docRef.id;
  }
  return entity;
};
