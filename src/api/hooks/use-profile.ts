import { useRecoilValue } from 'recoil';

import { Profile } from '@/api/model/profile';
import { User } from '@/api/model/user';
import { authState } from '@/api/state/auth';

export const useProfile = () => {
  const user = useRecoilValue(authState) as User;
  const profile: Profile = { ...user };

  return { profile };
};
