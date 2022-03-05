import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/api/hooks/use-auth';

const LogOut = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => await logOut(() => navigate('/')))();
  }, [logOut, navigate]);

  return null;
};

export default LogOut;
