import { tv } from '#/utils/tv';
import iconsHref from './icons.svg';

type IconName =
  | 'calendar'
  | 'chevrons-up-down'
  | 'dices'
  | 'folder'
  | 'folder-sync'
  | 'folders'
  | 'house'
  | 'list-ordered'
  | 'log-out'
  | 'menu'
  | 'moon'
  | 'pilcrow'
  | 'scale'
  | 'shield'
  | 'smile-plus'
  | 'sun'
  | 'trophy'
  | 'user'
  | 'users'
  | 'x';

const styles = tv({ base: 'inline size-5' });

namespace Icon {
  export interface Props extends React.SVGProps<SVGSVGElement> {
    name: IconName;
  }
}

function Icon({ name, className, children, ...props }: Icon.Props) {
  if (children) {
    return (
      <span className="flex items-center justify-center gap-2">
        <Icon name={name} className={className} {...props} />
        {children}
      </span>
    );
  }
  return (
    <svg
      {...props}
      role="img"
      aria-label={`${name} icon`}
      className={styles({ className })}
    >
      <use href={`${iconsHref}#${name}`} />
    </svg>
  );
}

export { Icon, type IconName };
