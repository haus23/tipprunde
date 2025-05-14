import type { RouteConfig } from '@react-router/dev/routes';

import { index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/foh/(layout)/index.tsx', [
    index('routes/foh/_index.tsx'),
    route('/login', 'routes/(auth)/login.tsx'),
    route('/kontrolle', 'routes/(auth)/verify-code.tsx'),
  ]),
  route('/hinterhof', 'routes/hinterhof/(layout)/index.tsx', [
    index('routes/hinterhof/_index.tsx'),
  ]),
] satisfies RouteConfig;
