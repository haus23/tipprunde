# Project: Tipprunde

## Next tasks

- Common
    - [ ] Switch to Prisma - Hm, probably not doable by now. See
          [Prisma Docs](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1) and
          the [GitHub discussion](https://github.com/prisma/prisma/discussions/23646)
    - [ ] Add tanstack-query, werde ich für das Backend nicht machen.
          Frontend könnte ein Caching vertragen
    - [ ] Use tooltips explicit (not coded in Button/Link - see shared-data/users/column-defs)
    - [ ] Need for custom form wrapper ?
    - [ ] Evaluate usage of meta-Function vs React 19 head tags

- Shared Data
  - [x] Users
  - [x] Teams
  - [ ] Leagues
  - [ ] Rulesets
  - [ ] Enable Forced (Re-)Sync

- Workflow
  - [ ] Enable preview builds (define production brand v1)
  - [ ] Add preview bindings (d1 and kv)

- Nice to have
  - [ ] Als Nicht-Admin den Hinterhof aufrufen -> Toast
  - [ ] OTP-Eingabe schon prüfen nach der 6. Ziffer
  - [ ] Spinning-Buttons oder ähnliches bei den Login-Buttons
  - [ ] Sidebar-Rail (siehe shadcn)
  - [ ] Evaluate: Vgl Menu-Styles (Theme-Menü mit Select). Align?
  - [ ] Animations
    - [ ] Mobile Nav
    - [ ] Theme Menu
    - [ ] Collapsible

## Todos

- Make root user variable (suche nach Root, ROOT_EMAIL, ...)
- Make default theme variable (siehe theme.ts)
- prefs.server.ts: Kann ich hier parsen (valibot), also auch wenn undefined reinkommt?

## Changelog

### Prerelease

- Create: `pnpx changelogen --noAuthors --preminor pre --bump --release --push`
- Bump: `pnpx changelogen --noAuthors --prerelease --bump --release --push`
