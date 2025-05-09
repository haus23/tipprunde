import { unstable_createContext } from 'react-router';

export interface AppContext {
  cloudflare: {
    env: Env;
    ctx: Omit<ExecutionContext, 'props'>;
  };
}

export const appContext = unstable_createContext<AppContext>();
