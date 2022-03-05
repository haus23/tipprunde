import {
  FirestoreDataConverter,
  PartialWithFieldValue,
  DocumentData,
} from 'firebase/firestore';
import { BaseModel } from '../base';

export const converter = <
  T extends BaseModel
>(): FirestoreDataConverter<T> => ({
  toFirestore: (modelObject: PartialWithFieldValue<T>): DocumentData => {
    const { id, ...doc } = modelObject;
    return doc;
  },
  fromFirestore: (snapshot) =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
    } as T),
});
