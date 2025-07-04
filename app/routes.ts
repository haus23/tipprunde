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
    ...prefix('/hinterhof', [
      index('routes/hinterhof/_index.tsx'),
      route('/wartung', 'routes/hinterhof/(maintenance)/_route.tsx'),
      route('/spieler', 'routes/hinterhof/shared-data/users/_route.tsx'),
      route('/teams', 'routes/hinterhof/shared-data/teams/_route.tsx'),
      route('/ligen', 'routes/hinterhof/shared-data/leagues/_route.tsx'),
    ]),
  ]),
  // Actions
  ...prefix('/action', [
    route('/set-theme', 'routes/(actions)/set-theme.ts'),
    route('/set-settings', 'routes/(actions)/set-settings.ts'),
    route('/sync/shared-data', 'routes/(actions)/sync/shared-data.ts'),
  ]),
] satisfies RouteConfig;
