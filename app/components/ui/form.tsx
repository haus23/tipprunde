import type { FormProps as _FormProps } from 'react-aria-components';

import { Form as _Form } from 'react-aria-components';

interface FormProps extends _FormProps {}

export function Form(props: FormProps) {
  return <_Form {...props} />;
}
