# Changelog


## v0.1.0

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.11...v0.1.0)

### 🚀 Enhancements

- Make the auth cookie a rolling cookie for remember-me sessions. ([3a67b47](https://github.com/haus23/tipprunde/commit/3a67b47))
- Add the login flow with a magic link. ([3761311](https://github.com/haus23/tipprunde/commit/3761311))

### 🩹 Fixes

- Re-enable code mailing. ([7314081](https://github.com/haus23/tipprunde/commit/7314081))

### 💅 Refactors

- Aligned route definitions. ([f5d69b6](https://github.com/haus23/tipprunde/commit/f5d69b6))

### 🏡 Chore

- **dx:** Add editorconfig. ([4ad065a](https://github.com/haus23/tipprunde/commit/4ad065a))
- Update deps and toolchain. ([42c715e](https://github.com/haus23/tipprunde/commit/42c715e))

## v0.0.11

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.10...v0.0.11)

### 🚀 Enhancements

- Broadcast auth state changes across browser tabs. ([9cdd221](https://github.com/haus23/tipprunde/commit/9cdd221))
- Add a checkbox component. ([7fdc868](https://github.com/haus23/tipprunde/commit/7fdc868))
- Implement the remember-me feature. ([75d689d](https://github.com/haus23/tipprunde/commit/75d689d))

### 🩹 Fixes

- Pattern was not applied. And: better active visibility in dark mode. ([c68f1d8](https://github.com/haus23/tipprunde/commit/c68f1d8))

### 💅 Refactors

- Bring back focus styles to align outlines. ([7ede76c](https://github.com/haus23/tipprunde/commit/7ede76c))
- Add transitions. ([7c07a40](https://github.com/haus23/tipprunde/commit/7c07a40))
- Add transitions. ([b54af64](https://github.com/haus23/tipprunde/commit/b54af64))

## v0.0.10

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.9...v0.0.10)

### 🚀 Enhancements

- Implement toast message creation in server code. ([b7c22d0](https://github.com/haus23/tipprunde/commit/b7c22d0))
- Add a server sessions table to the database. ([3bef9ce](https://github.com/haus23/tipprunde/commit/3bef9ce))
- Create a server and client session after successful code validation. ([df4573d](https://github.com/haus23/tipprunde/commit/df4573d))
- Authenticate the user in the root loader. ([978a984](https://github.com/haus23/tipprunde/commit/978a984))
- Add auth guards. Refactor server files. ([362d11f](https://github.com/haus23/tipprunde/commit/362d11f))
- Add client user hook. Rethink roles (no manager role needed by now). ([db64c47](https://github.com/haus23/tipprunde/commit/db64c47))
- Add layout logic. ([c04199f](https://github.com/haus23/tipprunde/commit/c04199f))

### 🩹 Fixes

- Redirect from code route if no login session is present. ([06f1b33](https://github.com/haus23/tipprunde/commit/06f1b33))
- Move the db singleton setting next to the db instance creation. ([7979252](https://github.com/haus23/tipprunde/commit/7979252))
- Remove flash data (the email) from the auth session. We need a new code. ([35d908d](https://github.com/haus23/tipprunde/commit/35d908d))
- Add a basic toast implementation. ([8bba557](https://github.com/haus23/tipprunde/commit/8bba557))
- Small layout change, add some margin. ([8149a86](https://github.com/haus23/tipprunde/commit/8149a86))
- Small layout change, make toasts wider. ([620b3f9](https://github.com/haus23/tipprunde/commit/620b3f9))

## v0.0.9

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.8...v0.0.9)

### 🚀 Enhancements

- Add d1 database binding. ([f392cce](https://github.com/haus23/tipprunde/commit/f392cce))
- Prepare drizzle for db development. ([aa5e98f](https://github.com/haus23/tipprunde/commit/aa5e98f))
- Create the first table: verifications ([2ae50e7](https://github.com/haus23/tipprunde/commit/2ae50e7))
- Put drizzle instance into appLoadContext and expose singleton instance. ([5521176](https://github.com/haus23/tipprunde/commit/5521176))
- Create and update a verification row entry. ([b6f5919](https://github.com/haus23/tipprunde/commit/b6f5919))
- Implement otp input field. ([df70ecc](https://github.com/haus23/tipprunde/commit/df70ecc))
- Add a code verify route. ([d30f1fd](https://github.com/haus23/tipprunde/commit/d30f1fd))
- Integrate otp-input with react aria components. Add validation. ([84734c5](https://github.com/haus23/tipprunde/commit/84734c5))
- Validate submitted totp. ([98dcc6a](https://github.com/haus23/tipprunde/commit/98dcc6a))

### 🩹 Fixes

- Update schema and configure casing for the instance. ([ce6a6af](https://github.com/haus23/tipprunde/commit/ce6a6af))

## v0.0.8

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.7...v0.0.8)

### 🚀 Enhancements

- Add initial set of lean form components. ([ab9cc25](https://github.com/haus23/tipprunde/commit/ab9cc25))
- Add login form. ([0f3c197](https://github.com/haus23/tipprunde/commit/0f3c197))
- Create TOTP code. ([181a9e2](https://github.com/haus23/tipprunde/commit/181a9e2))
- Add security log email. ([2281234](https://github.com/haus23/tipprunde/commit/2281234))
- Add email sending via Email-SaaS. ([79dbc07](https://github.com/haus23/tipprunde/commit/79dbc07))

### 💅 Refactors

- Remove focus visible styling by now. ([49b1468](https://github.com/haus23/tipprunde/commit/49b1468))
- Move the mail addresses to secrets. Add email saas tokens. ([83d3a32](https://github.com/haus23/tipprunde/commit/83d3a32))

### 🏡 Chore

- Add react aria components dependency. ([2dd8fa0](https://github.com/haus23/tipprunde/commit/2dd8fa0))
- Update dev deps. ([db9f5e2](https://github.com/haus23/tipprunde/commit/db9f5e2))
- Update lucide icons and email components. ([29aba56](https://github.com/haus23/tipprunde/commit/29aba56))

## v0.0.7

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.6...v0.0.7)

### 🚀 Enhancements

- Add login route. ([a970946](https://github.com/haus23/tipprunde/commit/a970946))
- Add an auth session and secure the admin routes. ([b42fe76](https://github.com/haus23/tipprunde/commit/b42fe76))

### 💅 Refactors

- Drop unstable middleware by now. ([75e53b1](https://github.com/haus23/tipprunde/commit/75e53b1))
- Drop the server folder. ([3d80e99](https://github.com/haus23/tipprunde/commit/3d80e99))

## v0.0.6

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.5...v0.0.6)

### 🚀 Enhancements

- Initial take on the admin sidebar. Fix layout issue. ([679e289](https://github.com/haus23/tipprunde/commit/679e289))
- Validate environment vars. ([d34ddc6](https://github.com/haus23/tipprunde/commit/d34ddc6))

### 🩹 Fixes

- Add vite plugin to handle chrome devtool requests. ([ece605d](https://github.com/haus23/tipprunde/commit/ece605d))

### 💅 Refactors

- Switch to (unstable) middleware. ([85caacf](https://github.com/haus23/tipprunde/commit/85caacf))
- Create cleaner route folders. ([2c45264](https://github.com/haus23/tipprunde/commit/2c45264))
- Bring back the layouts. ([124fda3](https://github.com/haus23/tipprunde/commit/124fda3))
- Simplify env usage with nodejs compat flag. No need for cf context by now. ([1d67af9](https://github.com/haus23/tipprunde/commit/1d67af9))

## v0.0.5

[compare changes](https://github.com/haus23/tipprunde/compare/v0.0.4...v0.0.5)

### 🚀 Enhancements

- Switch to Geist font. ([cb14f68](https://github.com/haus23/tipprunde/commit/cb14f68))

### 🏡 Chore

- Update dev deps. ([bd6af07](https://github.com/haus23/tipprunde/commit/bd6af07))
- Upgrade react router. ([6828d3f](https://github.com/haus23/tipprunde/commit/6828d3f))

## v0.0.4


### 🚀 Enhancements

- Add a sidebar starter. And start styling the app. ([95fae8b](https://github.com/haus23/tipprunde/commit/95fae8b))

### 💅 Refactors

- Simplify the layout concept. ([456cee3](https://github.com/haus23/tipprunde/commit/456cee3))

### 🏡 Chore

- Update dev deps. ([ce26699](https://github.com/haus23/tipprunde/commit/ce26699))
- **dx:** Sort class names with biome. ([3d697cb](https://github.com/haus23/tipprunde/commit/3d697cb))

## v0.0.3


### 🚀 Enhancements

- Add an admin dashboard route and the layout concept. ([2bd52e7](https://github.com/haus23/tipprunde/commit/2bd52e7))

### 🏡 Chore

- **DX:** Add path alias. ([a3402ad](https://github.com/haus23/tipprunde/commit/a3402ad))
- **DX:** Configure import sorting. ([ca7b46a](https://github.com/haus23/tipprunde/commit/ca7b46a))

## v0.0.2


### 🚀 Enhancements

- Create send-code email. ([936005e](https://github.com/haus23/tipprunde/commit/936005e))
- Add public logos. ([f26aee2](https://github.com/haus23/tipprunde/commit/f26aee2))

### 🏡 Chore

- Add react-email for composing emails. ([7e61081](https://github.com/haus23/tipprunde/commit/7e61081))

## v0.0.1


### 🚀 Enhancements

- Add cloudflare var and load the current championship from unterbau. ([218be76](https://github.com/haus23/tipprunde/commit/218be76))

### 🏡 Chore

- Create a project. Initial commit. ([c01c690](https://github.com/haus23/tipprunde/commit/c01c690))
- Implement a minimal react router app with the dev toolchain. ([e8d8862](https://github.com/haus23/tipprunde/commit/e8d8862))
- Add a build step. ([43ff2a4](https://github.com/haus23/tipprunde/commit/43ff2a4))
- Add cloudflare integration via vite plugin. ([09f1f49](https://github.com/haus23/tipprunde/commit/09f1f49))
- Add page title and favicon. ([4ceb83a](https://github.com/haus23/tipprunde/commit/4ceb83a))
- Add tailwindcss. ([c35cd42](https://github.com/haus23/tipprunde/commit/c35cd42))
- Add biome for formatting and linting. Initial check run. ([3202cb4](https://github.com/haus23/tipprunde/commit/3202cb4))
