import type { LabelProps as _LabelProps } from 'react-aria-components';

import { Label as _Label } from 'react-aria-components';

interface LabelProps extends _LabelProps {}

export function Label(props: LabelProps) {
  return <_Label {...props} />;
}
