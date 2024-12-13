import { useEffect, useState } from 'react';
import { LinkContext } from 'react-aria-components';

import { Logo } from '#/components/logo';
import { ThemeChooser } from '#/components/theme-chooser';
import { Button } from '#/components/ui/button/button';
import { Dialog, DialogPanel } from '#/components/ui/dialog/dialog';
import { Icon, type IconName } from '#/components/ui/icon/icon';
import { Link, NavLink } from '#/components/ui/link/link';
import { useChampionships } from '#/utils/app/use-championships';

const navItems = [
  { path: '', label: 'Tabelle', icon: 'list-ordered' },
  { path: 'spieler', label: 'Spieler', icon: 'users' },
  { path: 'spiele', label: 'Spiele', icon: 'dices' },
] satisfies { path: string; label: string; icon: IconName }[];

export function Header() {
  const { currentChampionship, championships } = useChampionships();
  const championshipSegment = currentChampionship.slug;

  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    function closeDialog(ev: MediaQueryListEvent) {
      ev.matches && setOpen(false);
    }

    const query = window.matchMedia('(min-width: 420px)');
    query.addEventListener('change', closeDialog);
    return () => query.removeEventListener('change', closeDialog);
  }, []);

  // Eager return for now
  if (championships.length === 0) {
    return (
      <header className="mx-auto max-w-6xl p-2 wide:px-4">
        <div className="grid grid-cols-[1fr_auto] items-center">
          <Link to="/" className="pr-1">
            <Logo />
          </Link>
          <div>
            <ThemeChooser />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="mx-auto max-w-6xl p-2 wide:px-4">
      <div className="hidden grid-cols-[auto_1fr_auto] items-center gap-x-4 small:grid">
        <Link to="/" className="pr-1">
          <Logo />
        </Link>
        <nav className="flex items-center gap-x-2 pt-[3px]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/${[championshipSegment, item.path].filter(Boolean).join('/')}`}
              end
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <ThemeChooser />
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 small:hidden">
        <Dialog isOpen={isOpen} onOpenChange={(isOpen) => setOpen(isOpen)}>
          <LinkContext value={{ onPress: () => setOpen(false) }}>
            <Button variant="ghost">
              <Icon name="menu" />
            </Button>
            <DialogPanel className="fixed inset-2 bottom-auto mx-auto max-w-xl">
              {({ close }: { close: () => void }) => (
                <div className="relative flex flex-col divide-y divide-grey-6">
                  <header className="p-2">
                    <Link to="/" className="mr-12 flex">
                      <Logo />
                    </Link>
                  </header>
                  <nav className="flex flex-col items-stretch gap-y-2 p-2">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.path}
                        className="flex"
                        to={`/${[championshipSegment, item.path].filter(Boolean).join('/')}`}
                        end
                      >
                        <Icon name={item.icon}>{item.label}</Icon>
                      </NavLink>
                    ))}
                  </nav>
                  <div className="absolute top-2.5 right-2">
                    <Button variant="pure" onPress={close}>
                      <Icon name="x" className="size-6" />
                    </Button>
                  </div>
                </div>
              )}
            </DialogPanel>
          </LinkContext>
        </Dialog>
        <div />
        <div>
          <ThemeChooser />
        </div>
      </div>
    </header>
  );
}
