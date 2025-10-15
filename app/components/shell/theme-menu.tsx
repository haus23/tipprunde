import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import {
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Button,
} from "react-aria-components";
import { useTheme, type ColorScheme } from "~/utils/user-prefs";
import { useShell } from "./app-shell";

const colorSchemeConfig = {
  light: {
    icon: SunIcon,
    label: "Hell",
  },
  dark: {
    icon: MoonIcon,
    label: "Dunkel",
  },
  system: {
    icon: MonitorIcon,
    label: "System",
  },
} as const;

export function ThemeMenu() {
  const { colorScheme, setColorScheme } = useTheme();
  const { closeMobileNav, isDesktopNavCollapsed } = useShell();
  const CurrentIcon = colorSchemeConfig[colorScheme].icon;

  return (
    <MenuTrigger>
      <Button className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-default hover:bg-hover transition-colors w-full ${isDesktopNavCollapsed ? 'justify-center' : 'justify-start'}`}>
        <CurrentIcon size={18} className="flex-shrink-0" />
        <span className={`transition-opacity duration-300 ${isDesktopNavCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          Hell-/Dunkel-Modus
        </span>
      </Button>
      <Popover
        className="bg-popover border border-default rounded-lg shadow-lg p-1 min-w-56"
        offset={14}
      >
        <Menu
          className="outline-none"
          onAction={(key) =>
            setColorScheme(key as ColorScheme, { closeMobileNav })
          }
        >
          {Object.entries(colorSchemeConfig).map(([scheme, config]) => {
            const Icon = config.icon;
            const isSelected = scheme === colorScheme;

            return (
              <MenuItem
                key={scheme}
                id={scheme}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm cursor-pointer outline-none mb-0.5 last:mb-0
                  ${
                    isSelected
                      ? "bg-accent text-accent-contrast font-medium"
                      : "text-default hover:bg-hover"
                  }
                `}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{config.label}</span>
                {isSelected && <span className="ml-auto text-xs">✓</span>}
              </MenuItem>
            );
          })}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
