import { PanelLeftIcon } from 'lucide-react';
import { Group, Toolbar } from 'react-aria-components';

import { ThemeMenu } from '~/components/theme-menu';
import { Button } from '~/components/ui/button';

export function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between px-2 md:px-4">
      <div>
        <Button variant="toolbar">
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
