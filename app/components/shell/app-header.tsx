import { PanelLeftIcon } from 'lucide-react';
import { Group, Toolbar } from 'react-aria-components';

import { useShell } from '~/components/shell/shell-provider';
import { ThemeMenu } from '~/components/theme-menu';
import { Button } from '~/components/ui/button';
import { useIsMobile } from '~/utils/misc';

export function AppHeader() {
  const { toggleSidebar, toggleMobileNav } = useShell();
  const isMobile = useIsMobile();

  function handleSidebarClick() {
    if (isMobile) {
      toggleMobileNav();
    } else {
      toggleSidebar();
    }
  }

  return (
    <header className="flex h-14 items-center justify-between px-2">
      <div>
        <Button variant="toolbar" onClick={handleSidebarClick}>
          <PanelLeftIcon className="size-5" />
        </Button>
      </div>
      <Toolbar>
        <Group>
          <ThemeMenu />
        </Group>
      </Toolbar>
    </header>
  );
}
