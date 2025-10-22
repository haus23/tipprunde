# Changelog


## v0.1.0-pre.5

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0-pre.4...v0.1.0-pre.5)

### 🚀 Enhancements

- Guard the auth routes. ([b382745](https://github.com/haus23/tipprunde/commit/b382745))
- Add a root user. ([d76ee2b](https://github.com/haus23/tipprunde/commit/d76ee2b))

### 🩹 Fixes

- Add missing loader in login route. See https://reactrouter.com/how-to/middleware#server-middleware ([e8cbeee](https://github.com/haus23/tipprunde/commit/e8cbeee))

### 💅 Refactors

- Make icons smaller. Removed log. ([24ba52e](https://github.com/haus23/tipprunde/commit/24ba52e))
- Join user server files. ([cf3abdf](https://github.com/haus23/tipprunde/commit/cf3abdf))

### 🏡 Chore

- Update dev toolchain. ([b51bd47](https://github.com/haus23/tipprunde/commit/b51bd47))
- Upgrade prisma. Prepare for prisma v7 ([fc241bf](https://github.com/haus23/tipprunde/commit/fc241bf))

## v0.1.0-pre.4

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0-pre.3...v0.1.0-pre.4)

### 🚀 Enhancements

- Validates user session and sets user context. ([71318bc](https://github.com/haus23/tipprunde/commit/71318bc))
- Add nav-link component. Use lucide icons. ([ff9a959](https://github.com/haus23/tipprunde/commit/ff9a959))
- Add user view. ([21b69ea](https://github.com/haus23/tipprunde/commit/21b69ea))
- Implement logout flow. ([7e6adbb](https://github.com/haus23/tipprunde/commit/7e6adbb))

### 💅 Refactors

- Extract auth session ([d98305a](https://github.com/haus23/tipprunde/commit/d98305a))
- Add user result extension and use prisma type ([23cf263](https://github.com/haus23/tipprunde/commit/23cf263))

## v0.1.0-pre.3

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0-pre.2...v0.1.0-pre.3)

### 🚀 Enhancements

- Add runtime validation of env vars. ([27fb688](https://github.com/haus23/tipprunde/commit/27fb688))
- Create totp code. ([dd727ed](https://github.com/haus23/tipprunde/commit/dd727ed))
- Add otp input component. ([efabc8c](https://github.com/haus23/tipprunde/commit/efabc8c))
- Implement login flow. ([42a82c1](https://github.com/haus23/tipprunde/commit/42a82c1))

### 💅 Refactors

- Prepare onboarding with email validation and create auth session. ([302c0a4](https://github.com/haus23/tipprunde/commit/302c0a4))
- Move the db singleton into the db folder. ([9bc72c7](https://github.com/haus23/tipprunde/commit/9bc72c7))

## v0.1.0-pre.2

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0-pre.1...v0.1.0-pre.2)

### 🚀 Enhancements

- Add basic hinterhof backend routes. ([67e7952](https://github.com/haus23/tipprunde/commit/67e7952))
- Implement basic auth concept as proof-of-concept. ([7069e6e](https://github.com/haus23/tipprunde/commit/7069e6e))
- Add prisma orm. ([216fa9a](https://github.com/haus23/tipprunde/commit/216fa9a))
- Add ui components and implement login form. ([56f467e](https://github.com/haus23/tipprunde/commit/56f467e))
- Add singleton utility ([4773e64](https://github.com/haus23/tipprunde/commit/4773e64))
- Validate email address implemented. ([05ec428](https://github.com/haus23/tipprunde/commit/05ec428))

### 💅 Refactors

- Simplify prisma client generation. ([94320eb](https://github.com/haus23/tipprunde/commit/94320eb))

## v0.1.0-pre.1

[compare changes](https://github.com/haus23/tipprunde/compare/v0.1.0-pre.0...v0.1.0-pre.1)

### 🚀 Enhancements

- Add empty layout to foh. ([56a8269](https://github.com/haus23/tipprunde/commit/56a8269))
- Add basic foh routes. ([485f494](https://github.com/haus23/tipprunde/commit/485f494))

### 💅 Refactors

- Switch to filesystem routes. ([a5c7e6b](https://github.com/haus23/tipprunde/commit/a5c7e6b))

### 🏡 Chore

- Drop RSC for now. Wait for a migration path. ([53d207d](https://github.com/haus23/tipprunde/commit/53d207d))

## v0.1.0-pre.0

### 🏡 Chore

- Create minimal app. Initial commit. ([bfbdb3b](https://github.com/haus23/tipprunde/commit/bfbdb3b))
