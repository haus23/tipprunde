import { Link, NavLink } from 'react-router';
import { Logo } from '#/components/logo';

const navItems = [
  { path: '/', label: 'Tabelle' },
  { path: '/spieler', label: 'Spieler' },
  { path: '/spiele', label: 'Spiele' },
];

export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center gap-x-4 p-2 wide:px-4">
      <Link to="/">
        <Logo />
      </Link>
      <nav className="flex items-center gap-x-2 pt-[3px]">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.path}
            className="transition-colors aria-[current]:text-accent-11"
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
