import { atom } from 'recoil';
import { User } from '@/api/model/user';
import { auth } from '@/api/firebase/auth';

export const authState = atom<User | null>({
  key: 'auth',
  effects: [
    ({ setSelf }) =>
      auth.onAuthStateChanged((fbUser) => {
        const user: User | null =
          fbUser === null
            ? null
            : {
                email: fbUser.email as string,
                name: fbUser.displayName,
                photoURL: fbUser.photoURL,
              };
        setSelf(user);
      }),
  ],
});
