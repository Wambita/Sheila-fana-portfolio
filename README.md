# Sheila Fana | Personal Portfolio

A personal portfolio showcasing software development,
UI/UX design, cybersecurity, AI, robotics, and emerging technologies.

## Status

Phase 1, foundations. See [docs/08-development-plan.md](./docs/08-development-plan.md)
for the roadmap and [docs/brand-style-guide.md](./docs/brand-style-guide.md) for the brand.

## Getting started

Requires Node 24 LTS (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run check      # lint, typecheck, format, brand guard, unit tests
npm run build && npm run test:e2e   # end-to-end + accessibility tests
```

## Project Documentation

See the [docs](./docs) directory for project planning,
requirements, architecture, design, and development documentation.

## Project Structure

- docs/ - Project documentation
- public/ - Static assets
- src/ - Application source code
- src/app/ - Application entry points
- src/components/ - Reusable UI components
- src/features/ - Feature-specific modules
- src/lib/ - Utilities and libraries
- src/styles/ - Global styles
- src/types/ - TypeScript definitions
