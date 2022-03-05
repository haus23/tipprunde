import { useRecoilValue } from 'recoil';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/auth';
import { authState } from '../state/auth';

export const useAuth = () => {
  const user = useRecoilValue(authState);

  const logIn = async (
    email: string,
    password: string,
    successHandler: () => void
  ) => {
    await signInWithEmailAndPassword(auth, email, password);
    successHandler();
  };

  const logOut = async (successHandler: () => void) => {
    await signOut(auth);
    successHandler();
  };

  return { isAuthenticated: user !== null, logIn, logOut };
};
