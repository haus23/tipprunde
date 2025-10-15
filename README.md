# Projekt: Tipprunde

## Roadmap Task

### v0.2.0

- Collapsible Sidebar on Desktop
- CSS Variable for sidebar width (collapsed or not)
- Persist collapsed state in prefs

### v0.3.0 (Auth)

- Auth Session
- Login Form
- Prisma Setup
- Email Validation


## Claude Code instructions:

- Git Commands:

  Prerelease
    - Create: pnpx changelogen --noAuthors --preminor pre --bump --release --push
    - Bump: pnpx changelogen --noAuthors --prerelease --bump --release --push
    - Release: pnpx changelogen --noAuthors --bump --release --push

- Valibot:

  Always infer types from Output, if derived from Input add "Input" postfix.
