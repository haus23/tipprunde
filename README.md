# Haus23 Tipprunde

A modern tipping competition platform built with React Router v7 and better-sqlite3.

## Tech Stack

- **Framework**: React Router v7
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS v4
- **UI Components**: React Aria Components
- **Authentication**: Passwordless TOTP (Time-based One-Time Password)
- **Email**: Resend API with @react-email/components
- **Runtime**: Node.js 24.10+

## Prerequisites

- Node.js 24.10 or higher
- pnpm (package manager)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_PATH=db/dev.db
AUTH_SESSION_SECRET=your-secret-here
TOTP_PERIOD=300
TOTP_ATTEMPTS=3
WELCOME_EMAIL=welcome@yourdomain.com
SECURITY_EMAIL=security@yourdomain.com
ROOT_EMAIL=admin@yourdomain.com
RESEND_TOKEN=your-resend-api-token
```

### 3. Initialize the database

```bash
pnpm run db:migrate up
```

### 4. Seed the database

```bash
ROOT_EMAIL=admin@example.com pnpm run db:seed
```

### 5. Start the development server

```bash
pnpm run dev
```

## Database Management

### Migrations

- **Run migrations**: `pnpm run db:migrate up`
- **Reset database**: `pnpm run db:migrate reset` (drops all tables and re-runs migrations)

### Seed Data

- **Seed root user**: `ROOT_EMAIL=your@email.com pnpm run db:seed`

## Project Structure

```
tipprunde/
├── app/
│   ├── components/         # Reusable UI components
│   ├── lib/
│   │   ├── auth/          # Authentication logic
│   │   └── db/            # Database layer (DAL)
│   ├── routes/            # React Router routes
│   └── utils/             # Utility functions
├── db/
│   ├── migrations/        # SQL migration files
│   ├── migrate.js         # Migration script
│   └── seed.js           # Database seeding script
├── emails/                # Email templates (React components)
└── public/               # Static assets
```

## Features

- **Passwordless Authentication**: Login via email with time-limited codes
- **Security Monitoring**: Automatic email notifications for invalid login attempts
- **Session Management**: Secure cookie-based sessions with "remember me" option
- **Email Templates**: React-based email templates with Resend API
- **Type-Safe Database**: TypeScript-first data access layer

## Development

### Code Style

- Database columns use camelCase (not snake_case)
- Type definitions over interfaces for data shapes
- No ORMs - direct SQL queries for full control

### Authentication Flow

1. User enters email on `/login`
2. System validates email and generates TOTP code
3. Code sent via email (valid for 5 minutes, 3 attempts)
4. User enters code on `/verify`
5. Session created with optional "remember me" duration

## License

MIT
