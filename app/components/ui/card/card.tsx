import type { ComponentProps } from 'react';
import { tv } from '#/utils/tv';

const styles = tv({
  slots: {
    card: 'rounded-xl bg-white shadow-box-medium dark:bg-grey-2',
    cardHeader: 'p-4 wide:p-6 text-grey-12',
    cardBody: 'p-4 wide:p-6',
  },
});

const { card, cardHeader, cardBody } = styles();

namespace Card {
  export interface Props extends ComponentProps<'article'> {}
}

export function Card({ className, ...props }: Card.Props) {
  return <article className={card({ className })} {...props} />;
}

namespace CardHeader {
  export interface Props extends ComponentProps<'header'> {}
}

export function CardHeader({ className, ...props }: CardHeader.Props) {
  return <header className={cardHeader({ className })} {...props} />;
}

namespace CardBody {
  export interface Props extends ComponentProps<'div'> {}
}

export function CardBody({ className, ...props }: CardBody.Props) {
  return <div className={cardBody({ className })} {...props} />;
}
