import { type FormProps, Form as RACForm } from 'react-aria-components';
import { useSubmit } from 'react-router';
import { tv } from '#/utils/tv';

const styles = tv({});

namespace Form {
  export interface Props extends FormProps {}
}

export function Form({
  className,
  method = 'post',
  onSubmit,
  ...props
}: FormProps) {
  const submit = useSubmit();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (onSubmit) {
      onSubmit(e);
    } else {
      e.preventDefault();
      submit(e.currentTarget);
    }
  }

  return (
    <RACForm
      className={styles({ className })}
      method={method}
      onSubmit={handleSubmit}
      {...props}
    />
  );
}
