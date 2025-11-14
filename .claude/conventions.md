# Tipprunde Conventions

This document outlines coding standards and design principles for the tipprunde project.

## Code Style

### General
- **Early exits**: Use guard clauses first, avoid nested conditionals
- **Return types**: Infer when possible, only explicit when necessary
- **Imports**: No dynamic imports - keep it simple and static
- **Type definitions**: Use `type` aliases over `interface` for data shapes

### Naming
- **Files**: English names (e.g., `championships/create.tsx`)
- **Routes**: German paths (e.g., `/turniere/neu`)
- **Folders**: English, except `hinterhof` (intentional exception)
- **Database columns**: camelCase (e.g., `createdAt`, not `created_at`)

## Database

### Architecture
- **No ORMs**: Direct SQL queries using better-sqlite3
- **Primary Keys**: Domain values for stable entities (teams, leagues, championships), integers for internal entities
- **Migrations**: SQL-based, tracked in `_migrations` table
- **Seeds**: Idempotent scripts in `db/seed/` folder

### Conventions
- Column names in camelCase
- Timestamps: `createdAt`, `updatedAt` with auto-update triggers
- Boolean columns: `published`, `completed` (no `is` prefix)
- Nullable columns for placeholder/optional data

## UI & Styling

### Color Tokens
Always use semantic color tokens, never hardcoded colors:

```css
/* Background Colors */
--background-color-base          /* Main page background */
--background-color-raised        /* Cards, elevated elements */
--background-color-overlay       /* Modals, dropdowns */
--background-color-subtle        /* Hover states, disabled */
--background-color-emphasis      /* High-contrast overlays (tooltips, badges, toasts) */
--background-color-accent        /* Primary actions, CTAs */
--background-color-accent-hover  /* Hover state for accent elements */

/* Text Colors */
--text-color-primary       /* Main text, headings */
--text-color-secondary     /* Supporting text */
--text-color-tertiary      /* Muted text, placeholders */
--text-color-emphasis      /* Text on emphasis backgrounds */
--text-color-accent        /* Links, accent icons */
--text-color-on-accent     /* Text on accent backgrounds */

/* Border Colors */
--border-color-default     /* Standard borders */
--border-color-subtle      /* Dividers, light borders */
```

Usage: `bg-base`, `text-primary`, `border-default`, `bg-accent`, `text-on-accent`

### Layout
- **Vertical spacing**: `flex flex-col gap-*` (NOT `space-y-*`)
- **No arbitrary padding**: Let parent containers handle spacing
- **Consistent backgrounds**: Apply to shell components, not individual pages

### Components
- **React Aria Components**: Use for accessible UI primitives
- **No emojis**: Unless explicitly requested by user
- **Icon buttons**: Use lucide-react icons

### Typography
- **Headlines**: Use `font-medium` (NOT `font-bold`)
- **Text hierarchy**: Rely on size and color, not font weight

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── shell/          # Layout components (AppShell, AppSidebar, etc.)
│   ├── ui/             # Base UI components (Button, TextField, etc.)
│   └── [feature]/      # Feature-specific components
├── lib/
│   ├── auth/           # Authentication logic
│   ├── db/             # Database layer (DAL functions)
│   └── model/          # Domain type definitions
├── routes/             # React Router route components
└── utils/              # Utility functions

db/
├── migrations/         # SQL migration files
└── seed/               # Database seeding scripts
```

## Domain Model

### Championships
- Called "Turnier" in German UI
- ID format: `hr0203` (hinrunde), `rr2425` (rückrunde), `em2024` (tournaments)
- Sequential numbering starting from 1 (2002)

### Rules
- Separate rule IDs for tip scoring, joker mechanics
- Rules referenced by championships, not embedded
- Strategy pattern for rule calculations

## Authentication

- Passwordless TOTP via email
- Cookie-based sessions with optional "remember me"
- Role-based permissions: ADMIN, MANAGER, USER
- Simple permission helpers: `isAdmin()`, `isManager()`, `isAuthenticated()`

## Development Workflow

1. Build features incrementally
2. Start with DAL functions
3. Then build UI
4. Test locally before committing
5. Use slash commands for releases (`/bump-prerelease`, `/release`)
