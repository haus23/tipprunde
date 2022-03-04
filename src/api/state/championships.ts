import { collection, getDocs } from 'firebase/firestore';
import { atom } from 'recoil';
import { db } from '../firebase/db';
import { converter } from '../model/base';
import { Championship } from '../model/championship';

export const championshipsState = atom({
  key: 'championships',
  default: (async () =>
    (
      await getDocs(
        collection(db, 'championships').withConverter(converter<Championship>())
      )
    ).docs.map((d) => d.data()))(),
});
