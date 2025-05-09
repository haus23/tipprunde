import type { unstable_InitialContext } from 'react-router';
import type { AppContext } from '~/utils/app-context.server';

import { appContext } from '~/utils/app-context.server';

type GetLoadContextArgs = {
  request: Request;
  context: AppContext;
};

export function getLoadContext({
  context,
}: GetLoadContextArgs): unstable_InitialContext {
  let map = new Map();
  map.set(appContext, context);
  return map;
}
