import type { RouteConfig } from '@react-router/dev/routes';

import { index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/_layout.tsx', [index('routes/index.tsx')]),
  route('/hinterhof', 'routes/admin/_layout.tsx', [
    index('routes/admin/index.tsx'),
  ]),
] satisfies RouteConfig;
