import { createRequestHandler } from 'react-router';

import { initializeApp } from '~/app';

const requestHandler = createRequestHandler(
  // @ts-ignore
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    initializeApp(env);

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
