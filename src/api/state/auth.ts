import { atom } from 'recoil';
import { auth } from '../firebase/auth';
import { User } from '../model/user';

export const authState = atom<User | null>({
  key: 'auth',
  default: null,
  effects: [
    ({ setSelf }) =>
      auth.onAuthStateChanged((user) => {
        if (user === null) {
          setSelf(null);
        } else {
          setSelf({
            email: user.email as string,
            name: user.displayName,
            photoURL: user.photoURL,
          });
        }
      }),
  ],
});
