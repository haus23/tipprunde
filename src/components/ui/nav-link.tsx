import { createLink, type LinkComponent } from "@tanstack/react-router";
import { cva } from "~/utils/cva";

const navLinkClasses = cva({
  base: ["flex items-center gap-2 px-1", "[&>svg]:size-5 [&>svg]:shrink-0"],
});

interface NavLinkComponentProps extends React.ComponentProps<"a"> {
  ref: React.RefObject<HTMLAnchorElement>;
}

function NavLinkComponnent({
  className,
  ref,
  ...props
}: NavLinkComponentProps) {
  return <a ref={ref} className={navLinkClasses({ className })} {...props} />;
}

const _NavLink = createLink(NavLinkComponnent);

export const NavLink: LinkComponent<typeof NavLinkComponnent> = (props) => {
  return <_NavLink preload={"intent"} {...props} />;
};
