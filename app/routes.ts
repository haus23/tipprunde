import type { RouteConfig } from '@react-router/dev/routes';

import { index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  layout('routes/foh/(layout)/index.tsx', [
    index('routes/foh/_index.tsx'),
    route('/login', 'routes/(auth)/login.tsx'),
    route('/logout', 'routes/(auth)/logout.ts'),
    route('/kontrolle', 'routes/(auth)/verify-code.tsx'),
  ]),
  layout('routes/hinterhof/(layout)/index.tsx', [
    ...prefix('/hinterhof', [index('routes/hinterhof/_index.tsx')]),
  ]),
] satisfies RouteConfig;
