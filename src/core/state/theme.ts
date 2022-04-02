import { atom } from 'recoil';

export const themeState = atom({
  key: 'theme',
  default: localStorage.getItem('theme') || 'system',
  effects: [
    ({ onSet }) => {
      onSet((theme) => {
        if (theme === 'system') {
          localStorage.removeItem('theme');
        } else {
          localStorage.setItem('theme', theme);
        }
      });
    },
  ],
});
