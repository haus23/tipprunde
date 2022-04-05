import { collection, doc, DocumentReference, setDoc } from 'firebase/firestore';
import { db } from '@/api/firebase/db';
import { converter } from '@/api/model/repository/converter';
import { BaseModel } from '../base/Model';

/**
 * Creates an entity with id
 *
 * If entity.id is falsy, firestore will create a unique id.
 * If entity.id is truthy set, given id will be used.
 *
 * @param path
 * @param entity
 */
export const createWithId = async <T extends BaseModel>(
  path: string,
  entity: T
) => {
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
