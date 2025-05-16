import { createContext } from 'react';

type ActionContextType = {
  onAction: () => void;
};

export const ActionContext = createContext<ActionContextType | undefined>(
  undefined,
);
