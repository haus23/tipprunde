import { atom } from 'recoil';
import { auth } from '../firebase/auth';
import { User } from '../model/user';

let authPromiseResolver: (user: User | null) => void;
let authPromisePending = true;
const authPromise = new Promise<User | null>((resolve) => {
  authPromiseResolver = resolve;
});

export const authState = atom<User | null>({
  key: 'auth',
  default: authPromise,
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

        if (authPromisePending) {
          authPromiseResolver(user);
          authPromisePending = false;
        } else {
          setSelf(user);
        }
      }),
  ],
});
