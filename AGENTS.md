# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, and others) when working with code in this repository.

## Project overview

Angular 20 standalone-component frontend (no NgModules). Uses Angular Material 20, Angular CDK 20, Bootstrap 5 (grid/utilities only), and RxJS. Package manager is pnpm (see `angular.json` → `cli.packageManager`).

## Commands

- `npm run start-local` — dev server with `local` config (talks to backend at `http://localhost:8080/api/v1/`, see `src/environments/environment.local.ts`)
- `npm run start-docker` — dev server with `docker` config (`src/environments/environment.docker.ts`)
- `npm run build` / `npm run build-docker` — production build (production / docker config)
- `npm run watch` — incremental dev build
- `ng test` — Karma/Jasmine unit tests
- To run a single spec, use Angular CLI's Karma filtering, e.g. `ng test --include='**/auth.guard.spec.ts'`

Do not run these commands yourself unless explicitly asked — per project convention, do not test through the console (no npm/lint/build execution on your own initiative).

## Architecture

### Feature-based structure
Code under `src/app` is organized by domain, not by layer:
- `features/<domain>/` — `pages/` (routed components), `components/` (dumb/presentational pieces), `services/`, `models/`. Current domains: `settings`, `training`, `user`.
- `security/` — authentication/session concerns: `pages/` (login, registration), `services/` (`AuthenticationService`, guards, HTTP interceptor), `models/`.
- `navigation/` — app shell/toolbar.
- `shared/` — cross-feature reusable pipes, directives, validators, enums, models, and services (snackbar notifications, form utils, etc.).

Each feature with routed pages exposes a `routes.ts` that is lazy-loaded via `loadChildren` from `app.routes.ts`. Routes for single components use `loadComponent`. Comment in `app.routes.ts` documents the intent explicitly: don't use `loadComponent` for a whole feature's entry route if it would leak feature internals into `app.routes.ts` — use `loadChildren` + the feature's own `routes.ts` instead.

### Auth flow
- `AuthenticationService` (`security/services/authentication.service.ts`) holds session state in a signal (`currentUserSignal`), backed by a JWT stored in `localStorage` (`token`, `userId`).
- `authGuard` (`security/services/guards/auth.guard.ts`) is applied per-route in `app.routes.ts`; it calls `authenticationService.isAuthenticated()`, which re-fetches the current user by ID to validate the session, and redirects to `/login` on failure.
- `roleGuard` (`security/services/guards/role.guard.ts`) exists as a stub (always returns `true`) — role-based route restriction is not yet implemented. Permission/role checks that do exist live on `AuthenticationService` (`userHasAllAuthorities`, `userHasOneOfTheAuthorities`, `userHasOneOfTheRoles`) against the `Permission`/`Role` enums in `features/user/models/`.
- `httpSecurityInterceptor` (functional `HttpInterceptorFn`, registered via `provideHttpClient(withInterceptors([...]))` in `app.config.ts`) attaches the bearer token from `localStorage` to every outgoing request.

### App bootstrap
`app.config.ts` wires providers for a standalone app: router, `HttpClient` with the security interceptor, and animations. There is no `AppModule`.

### Styling
- Global styles enter through `src/styles.scss`, importing `src/assets/style/main.scss`/`template.scss`/`colors.scss`.
- Angular Material 20 token-based style overrides (not the old `--mdc-*` CSS variables) live under `src/assets/style/custom/material-components/`, applied via `@include mat.<component>-overrides((...))`. See `src/assets/style/custom/README.md` and `MATERIAL-TOKENS-GUIDE.md` in the same folder before touching Material component styling — they document the token system and existing reusable SCSS mixins in `form-field-tokens-examples.scss`.
- Component styles use SCSS (`.scss`, default schematic style per `angular.json`).

### Environments
Three environment files (`environment.local.ts`, `environment.docker.ts`, `environment.ts`) are swapped via `fileReplacements` per build configuration (`local`, `docker`, `development`, `production`). All API calls go through `environment.endpointUri`.
