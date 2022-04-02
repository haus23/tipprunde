import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextField from '@/components/atoms/TextField';
import Button from '@/components/atoms/Button';
import FormPanel from '@/components/FormPanel';

type LoginFormType = {
  email: string;
  password: string;
};

export default function LogIn() {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const onSubmit: SubmitHandler<LoginFormType> = async ({
    email,
    password,
  }) => {
    console.log('Trying to log in with ', email, password);
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
