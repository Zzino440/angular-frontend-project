# Angular Frontend Project Guidelines

## Commands
- Build: `npm run build`, `npm run build-docker` (for Docker env)
- Start: `npm start`, `npm run start-local` (local env), `npm run start-docker` (Docker env)
- Test: `npm test` (all tests), `ng test --include=src/path/to/file.spec.ts` (single test)
- Watch: `npm run watch` (build and watch)

## Code Style
- **Formatting**: 2-space indentation, UTF-8 charset, single quotes for TS
- **Imports**: Group by category (Angular, third-party, app), sort alphabetically
- **Components**: Standalone components with explicit imports
- **Naming**: camelCase for properties/methods, PascalCase for classes/interfaces
- **Types**: Always use explicit typing, avoid `any`
- **Error Handling**: Use RxJS `pipe()` with `takeUntil()` for subscription management
- **State Management**: Prefer Angular Signals (`signal()`, `computed()`) for reactive state
- **Dependency Injection**: Use `inject()` function for services
- **Component Structure**: Properties first, then constructor, lifecycle hooks, methods last