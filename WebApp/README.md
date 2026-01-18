# TODA-MAX Admin WebApp

A React + TypeScript app powered by Vite, with first-class linting (ESLint flat config) and Git hooks (Husky) to keep code quality consistent.

## Tech Stack
- **Build tool**: Vite
- **UI**: React + TypeScript
- **Linting**: ESLint (flat config with `typescript-eslint`, React, Hooks, React Refresh)
- **Editor/Build lint**: `vite-plugin-eslint` (auto-fix enabled)
- **Git hooks**: Husky (optional: lint-staged)

## Getting Started
- **Install**
  - npm: `npm install`

- **Development**
  - `npm run dev` — start Vite dev server with HMR

- **Build**
  - `npm run build` — build for production
  - `npm run preview` — preview the production build locally

## Linting
- ESLint is configured via `eslint.config.js` (flat config) using `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
- Vite runs ESLint through `vite-plugin-eslint` and applies safe auto-fixes on-the-fly:
  - `vite.config.ts` includes `eslint({ fix: true })`.
- Run lint manually:
  - `npm run lint` (if defined) or `npx eslint .`.

### TypeScript note (Vite config)
Some versions of `vite-plugin-eslint` ship types that aren’t resolved via package exports. A local shim is included:
- `types/vite-plugin-eslint.d.ts`
- `tsconfig.node.json` includes `types/**/*.d.ts`

## Husky (Git hooks)
Husky v9 uses the `prepare` script and plain hook files.

1) Install Husky
- `npm i -D husky`
- `npm pkg set scripts.prepare="husky"`
- `npm run prepare` (creates `.husky/`)

2) Add a pre-commit hook
Create `.husky/pre-commit`:
```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

Optional: lint only staged files
- `npm i -D lint-staged`
- Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint --fix"
  }
}
```
- Update `.husky/pre-commit` to run `npx lint-staged`.

## Project Scripts (typical)
- `dev`: start dev server
- `build`: build for production
- `preview`: preview built app
- `lint`: run eslint

## Troubleshooting
- Husky on Windows requires Git Bash (installed with Git), because hooks are shell scripts.
- If TypeScript reports missing types for `vite-plugin-eslint`, ensure the shim and `tsconfig.node.json` include are present.

## License
MIT
