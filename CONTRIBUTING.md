# Contributing to Darts Checkout Trainer

## Architecture Overview

Single-page React application for practicing darts checkout routes. Users can look up checkout routes for any score (2–170), test themselves with randomized quizzes, and view statistics on which doubles appear most frequently.

### Tech Stack

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Framework   | React 19 with TypeScript (strict mode)      |
| Styling     | Tailwind CSS 4 (via Vite plugin)            |
| Build       | Vite 7                                      |
| Testing     | Vitest + happy-dom + React Testing Library  |
| Icons       | react-icons (Feather icon set)              |
| Deployment  | GitHub Pages via `gh-pages`                 |

### Directory Structure

```
src/
├── main.tsx              # React root, renders <App />
├── App.tsx               # Top-level layout, mode-based navigation (no router)
├── constants.ts          # Score ranges, dartboard values, feedback messages
├── index.css             # Tailwind import + base background
├── App.css               # Empty (styles handled by Tailwind classes)
│
├── routes/               # Top-level "pages" (mode views)
│   ├── LookupMode/       # Score lookup with grid selector and drawer
│   │   ├── index.tsx
│   │   └── components/   # ScoreInput, CheckoutDrawer
│   ├── TestMode/         # Quiz mode with dartboard input
│   │   ├── index.tsx
│   │   └── components/   # SessionStart, SessionStats, QuestionDisplay,
│   │                     # FeedbackOverlay, ConfigModal, ActiveFilters
│   └── StatsMode.tsx     # Double distribution analysis
│
├── components/           # Shared UI components
│   ├── Button.tsx        # Variant-based button (primary/secondary/danger/success/ghost)
│   ├── CheckoutDisplay.tsx # Renders a single checkout route with edit action
│   ├── DartboardInput/   # Composite input: modifier buttons + score grid + bull buttons
│   │   ├── index.tsx
│   │   ├── DartDisplay.tsx
│   │   └── ModifierButton.tsx
│   ├── DoubleDistributionStats.tsx
│   ├── Drawer.tsx        # Bottom sheet overlay
│   ├── Modal.tsx         # Centered overlay dialog
│   ├── RouteEditor.tsx   # Edit/reset custom checkout routes
│   └── ScoreGrid.tsx     # Clickable grid of scores 2–170
│
├── hooks/                # Custom React hooks (business logic)
│   ├── useCheckoutRoutes.ts  # CRUD for checkout routes (default + custom via localStorage)
│   ├── useTestMode.ts        # Random question generation, answer checking, config persistence
│   ├── useSessionStats.ts    # Per-session accuracy and timing tracking
│   ├── useRouteEditor.ts     # Edit/save/reset workflow for a single route
│   └── useKeyPress.ts        # Keyboard shortcut listener
│
├── data/
│   └── defaultRoutes.ts  # All default checkout routes (scores 2–170), each with
│                         # oneDart, twoDarts, threeDarts arrays
│
└── utils/                # Pure functions (no React dependencies)
    ├── darts.ts          # DartScore type, notation parsing (T20, D16, BULL, OB, etc.)
    ├── storage.ts        # localStorage read/write with error handling, route merging
    ├── scores.ts         # Score range generator
    ├── validators.ts     # Score input validation (range, integer, checkout feasibility)
    ├── doubleDistribution.ts  # Calculates which doubles appear most in routes
    └── time.ts           # Time formatting and average calculation
```

### Key Concepts

**Navigation**: The app uses state-based mode switching (`useState<"lookup" | "test" | "stats">`), not a client-side router. Each mode renders a different route component.

**Dart Notation**: Scores use string notation — `T20` (treble 20), `D16` (double 16), `S5` (single 5), `BULL` (bullseye/double 25), `OB` (outer bull/single 25). The `DartScore` type is a `string` alias. Parsing and validation live in `utils/darts.ts`.

**Checkout Routes**: Default routes for every score from 2 to 170 are defined in `data/defaultRoutes.ts`. Each score maps to `{ oneDart, twoDarts, threeDarts }` arrays. Users can override any route; customizations are stored in localStorage under `darts-checkout-custom-routes`.

**State Persistence**: Two localStorage keys are used:
- `darts-checkout-custom-routes` — custom route overrides
- `darts-checkout-test-mode-config` — test mode filter preferences

All localStorage operations return `{ success, data?, error? }` result objects rather than throwing.

**Path Alias**: `@/` maps to `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Patterns and Conventions

- **Component co-location**: Route-specific components live in `routes/<Mode>/components/`. Shared components live in `components/`.
- **Hooks for logic**: Business logic is extracted into custom hooks (`hooks/`). Components handle rendering only.
- **Pure utility functions**: `utils/` contains functions with no React imports — suitable for unit testing without DOM setup.
- **Test co-location**: Test files sit next to their source files (`*.test.ts`).
- **Dark theme**: All UI uses Tailwind's gray-700/800/900 palette. There is no light mode.
- **TypeScript strict mode**: Enabled with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`.
- **No client-side router**: Mode switching is handled via React state in `App.tsx`.
- **`as const` assertions**: Used for constant arrays and objects to get literal types.

### Development

```bash
npm install       # Install dependencies
npm run dev       # Start Vite dev server
npm test          # Run Vitest in watch mode
npm run build     # Type-check + production build
npm run deploy    # Build and deploy to GitHub Pages
npm run lint      # Run ESLint
```

### Deployment

The app deploys to GitHub Pages at `https://HieronymusLex.github.io/darts-checkout-trainer/`. The Vite `base` option is set to `/darts-checkout-trainer/` to match the repository path. Static assets in `public/` (e.g., `logo.svg`) are served from this base path.
