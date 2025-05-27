# Project: Tipprunde

## Next tasks

- Common
  - [ ] Add tanstack-query, werde ich für das Backend nicht machen.
        Frontend könnte ein Caching vertragen
  - [ ] Use tooltips explicit (not coded in Button/Link - see shared-data/users/column-defs)
  - [ ] Need for custom form wrapper ?
  - [ ] Add a SearchField Wrapper for usage eg in table filters

- Users
  - [ ] Style the table at /hinterhof/spieler (inclusive xs-Design)
  - [x] Add pagination and filtering to the table
  - [x] Add a form to create/edit users
  - [ ] Persist pagination??
  - [ ] Add logic for the /hinterhof/wartung
    - [x] Add KV Binding
    - [x] Set last sync date
    - [x] Enable button only for recent updates
    - [x] Or if there are no synced users
    - [ ] Check use of async sync data and a suspense
  - [x] Let users log-in

- Workflow
  - [ ] Enable preview builds (define production brand v1)
  - [ ] Add preview bindings (d1 and kv)

- Nice to have
  - [ ] Als Nicht-Admin den Hinterhof aufrufen -> Toast
  - [ ] OTP-Eingabe schon prüfen nach der 6. Ziffer
  - [ ] Spinning-Buttons oder ähnliches bei den Login-Buttons
  - [ ] Sidebar-Rail (siehe shadcn)
  - [ ] Evaluate: Vgl Menu-Styles (Theme-Menü mit Select). Align?

## Todos

- Make root user variable (suche nach Root, ROOT_EMAIL, ...)
- Make default theme variable (siehe theme.ts)
- prefs.server.ts: Kann ich hier parsen (valibot), also auch wenn undefined reinkommt?
