import { createRequestHandler } from 'react-router';

import { initializeApp } from '~/app';

import { getLoadContext } from '../load-context';

const requestHandler = createRequestHandler(
  // @ts-ignore
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    initializeApp(env);

    const loadContext = getLoadContext({
      request,
      context: { cloudflare: { env, ctx } },
    });
    return requestHandler(request, loadContext);
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
