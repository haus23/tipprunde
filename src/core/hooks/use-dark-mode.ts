import { useRecoilState, useRecoilValue } from 'recoil';
import { themeState } from '@/core/state/theme';
import { darkModeState } from '@/core/state/dark-mode';

export const useDarkMode = () => {
  const [theme, setTheme] = useRecoilState(themeState);
  const darkMode = useRecoilValue(darkModeState);

  return { theme, setTheme, darkMode };
};
