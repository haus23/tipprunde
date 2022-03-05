import { useRecoilState } from 'recoil';
import { authState } from '../state/auth';

export const useProfile = () => {
  const [profile, setProfile] = useRecoilState(authState);

  return { profile: profile! };
};
