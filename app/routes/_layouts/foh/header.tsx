import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  LinkContext,
  Modal,
  ModalOverlay,
} from 'react-aria-components';

import { Logo } from '#/components/logo';
import { Button } from '#/components/ui/button/button';
import { Icon, type IconName } from '#/components/ui/icon/icon';
import { Link, NavLink } from '#/components/ui/link/link';

const navItems = [
  { path: '/', label: 'Tabelle', icon: 'list-ordered' },
  { path: '/spieler', label: 'Spieler', icon: 'users' },
  { path: '/spiele', label: 'Spiele', icon: 'dices' },
] satisfies { path: string; label: string; icon: IconName }[];

export function Header() {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    function closeDialog(ev: MediaQueryListEvent) {
      ev.matches && setOpen(false);
    }

    const query = window.matchMedia('(min-width: 420px)');
    query.addEventListener('change', closeDialog);
    return () => query.removeEventListener('change', closeDialog);
  }, []);

  return (
    <header className="mx-auto grid max-w-6xl items-center gap-x-4 p-2 wide:px-4">
      <div className="hidden grid-cols-[auto_1fr_auto] items-center gap-x-4 small:grid">
        <Link to="/" className="pr-1">
          <Logo />
        </Link>
        <nav className="flex items-center gap-x-2 pt-[3px]">
          {navItems.map((item) => (
            <NavLink to={item.path} key={item.path}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div />
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 small:hidden">
        <DialogTrigger
          isOpen={isOpen}
          onOpenChange={(isOpen) => setOpen(isOpen)}
        >
          <LinkContext value={{ onPress: () => setOpen(false) }}>
            <Button variant="ghost">
              <Icon name="menu" />
            </Button>
            <ModalOverlay
              className="fixed inset-0 backdrop-blur-xs"
              isDismissable
            >
              <Modal className="fixed inset-2 bottom-auto mx-auto max-w-xl rounded-md bg-white shadow-sm ring-1 ring-grey-6 dark:bg-grey-1">
                <Dialog className="outline-none">
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
                            to={item.path}
                            key={item.path}
                            className="flex"
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
                </Dialog>
              </Modal>
            </ModalOverlay>
          </LinkContext>
        </DialogTrigger>
      </div>
    </header>
  );
}
