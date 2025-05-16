import { PanelLeftIcon } from 'lucide-react';
import { Group, Toolbar } from 'react-aria-components';

import { useShell } from '~/components/shell/shell-provider';
import { ThemeMenu } from '~/components/theme-menu';
import { Button } from '~/components/ui/button';

export function AppHeader() {
  const { toggleSidebar } = useShell();

  return (
    <header className="flex h-14 items-center justify-between px-2 md:px-4">
      <div>
        <Button variant="toolbar" onClick={toggleSidebar}>
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
