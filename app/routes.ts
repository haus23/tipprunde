import type { RouteConfig } from '@react-router/dev/routes';

import { index, prefix } from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),
  ...prefix('/hinterhof', [index('routes/admin/index.tsx')]),
] satisfies RouteConfig;
