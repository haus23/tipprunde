import { deleteDoc, doc } from 'firebase/firestore';
import { BaseModel } from '@/api/model/base/Model';
import { db } from '@/api/firebase/db';

export const remove = async (path: string, docId: string | BaseModel) => {
  const id = typeof docId === 'string' ? docId : docId.id;
  await deleteDoc(doc(db, path, id));
};
