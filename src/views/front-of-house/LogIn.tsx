import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/api/hooks/use-auth';
import TextField from '@/components/atoms/TextField';
import Button from '@/components/atoms/Button';
import FormPanel from '@/components/FormPanel';

type LoginFormType = {
  email: string;
  password: string;
};

export default function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, logIn } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const state = location.state as { from: Location } | null;
  const from = state?.from.pathname || '/';

  const onSubmit: SubmitHandler<LoginFormType> = async ({
    email,
    password,
  }) => {
    try {
      await logIn(email, password, () => navigate(from, { replace: true }));
    } catch {
      setError('Email und/oder Passwort falsch!');
    }
  };
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-gray-50">
          Anmeldung
        </h2>
      </div>

      <FormPanel className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField
              label="Email"
              type="email"
              errorMsg={errors.email?.message}
              {...register('email', { required: 'Ohne geht es nicht!' })}
            />
          </div>

          <div>
            <TextField
              label="Passwort"
              type="password"
              errorMsg={errors.password?.message}
              {...register('password', {
                required: 'Passwort muss schon sein ;-)',
              })}
            />
          </div>

          <div className="flex justify-center">
            <Button primary className="w-32" type="submit">
              Log In
            </Button>
          </div>
          {error && (
            <div className="text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}
        </form>
      </FormPanel>
    </div>
  );
}
