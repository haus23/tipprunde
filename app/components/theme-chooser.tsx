import { useTheme } from '#/utils/theme';
import { Button } from './ui/button/button';
import { Icon } from './ui/icon/icon';

export function ThemeChooser() {
  const { theme } = useTheme();
  return (
    <Button variant="ghost" className="overflow-clip">
      <div className="relative size-5">
        <Icon
          name="moon"
          className={`absolute inset-0 origin-[50%_100px] transform transition-transform duration-300 ${theme.colorScheme === 'dark' ? 'rotate-0' : 'rotate-90'}`}
        />
        <Icon
          name="sun"
          className={`absolute inset-0 origin-[50%_100px] transform transition-transform duration-300 ${theme.colorScheme === 'light' ? 'rotate-0' : '-rotate-90'}`}
        />
      </div>
    </Button>
  );
}
