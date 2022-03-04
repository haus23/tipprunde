import { selector } from 'recoil';
import { themeState } from './theme';

// DOM Handling
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const setDarkClass = (darkMode: boolean) => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const darkModeState = selector({
  key: 'darkMode',
  get: ({ get }) => {
    const theme = get(themeState);

    const isSystemDark = darkModeQuery.matches;
    const darkMode = (theme === 'system' && isSystemDark) || theme === 'dark';

    setDarkClass(darkMode);
    return darkMode;
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});
