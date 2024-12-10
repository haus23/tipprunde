import type { RouteConfig } from '@react-router/dev/routes';
import { index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  layout('routes/_layouts/foh/_layout.tsx', [
    ...prefix(':championshipSlug?', [
      index('routes/foh/tables/_route.tsx'),
      route('spieler', 'routes/foh/players/_route.tsx'),
      route('spiele', 'routes/foh/matches/_route.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
