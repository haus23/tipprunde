import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';

export const useAuth = () => {
  const user = useRecoilValue(authState);

  return { isAuthenticated: user !== null };
};
