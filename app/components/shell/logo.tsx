import LogoImage from '~/assets/logo.svg?no-inline';

export interface LogoProps extends React.ComponentProps<'div'> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={className} {...props}>
      <svg
        role="img"
        aria-label="Haus 23 Logo"
        className="size-full fill-current"
      >
        <use href={`${LogoImage}#logo`} />
      </svg>
    </div>
  );
}
