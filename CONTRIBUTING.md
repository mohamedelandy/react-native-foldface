# Contributing

Contributions are very welcome: bug fixes, features, documentation, tests.

## Development

```sh
npm install
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
```

## Pull Requests

1. Fork the repository.
2. Create a feature branch from `main`.
3. Make your changes with tests.
4. Ensure all checks pass (`lint`, `typecheck`, `format:check`, `test`, `build`).
5. Open a pull request with a clear description of the change.

## Code Style

- TypeScript end to end.
- Follow the existing ESLint + Prettier configuration.
- Write tests for new features.
- Keep functions small and focused.

## Reporting Issues

Please include:

- A clear description of the problem.
- Steps to reproduce.
- Expected vs. actual behavior.
- Environment details (OS, React Native version, etc.).
