import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState } from '../state/dark-mode';
import { themeState } from '../state/theme';

export const useDarkMode = () => {
  const [theme, setTheme] = useRecoilState(themeState);
  const darkMode = useRecoilValue(darkModeState);

  return { theme, setTheme, darkMode };
};
