# Ledger — Tech Stack

> Technology choices and rationale for the Personal Finance Tracker.

---

## Core Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.x | UI library — component-based rendering, hooks, JSX |
| **Vite** | 5.x | Build tool — fast HMR, ESBuild-powered dev server, optimised production bundles |
| **JavaScript** (ES2022+) | — | Language — no TypeScript per project scope |

### Why React + Vite?

- React's component model maps naturally to the dashboard's modular UI (metrics, charts, tables, modals).
- Vite provides near-instant dev server startup and hot module replacement, making iterative UI work fast.
- No SSR needed — this is a fully client-side SPA.

---

## Routing

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Router** | v6.x | Client-side routing with nested layouts |

### Usage

- 7 top-level routes: `/`, `/transactions`, `/accounts`, `/budgets`, `/analytics`, `/investments`, `/settings`
- `<BrowserRouter>` with a shared `AppLayout` wrapper providing the navbar and content shell.
- `<Outlet />` pattern for nested rendering.

---

## Styling

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | v3.x or v4.x | Utility-first CSS framework |

### Why Tailwind?

- Utility classes keep styles co-located with JSX — no context-switching to separate CSS files.
- Theme extension (custom colors, fonts, spacing) creates the design system in `tailwind.config.js`.
- Dark mode via the `dark:` variant and a `class` strategy on `<html>`.
- Responsive design via `sm:`, `md:`, `lg:`, `xl:` breakpoint prefixes.
- No runtime CSS-in-JS overhead.

### Custom Design Tokens

Tailwind is extended with project-specific tokens:

```
Colors:     ivory, near-black, muted-gray, amber, emerald, muted-red, teal, gold, navy
Fonts:      font-display (Playfair Display), font-sans (Inter)
Spacing:    custom scale for section gaps (24–48px)
Radius:     4–10px (minimal rounding)
```

---

## Charts & Data Visualization

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Recharts** | 2.x | Declarative charting library built on React + D3 |

### Why Recharts?

- React-native: charts are JSX components, composable with the rest of the app.
- Supports all required chart types: `AreaChart`, `LineChart`, `BarChart`, `PieChart`.
- Built-in `<ResponsiveContainer>` for fluid sizing.
- Customisable tooltips, axes, and grid lines to achieve the minimal financial-report aesthetic.
- Lightweight compared to full D3 or chart.js wrappers.

### Chart Types Used

| Chart | Component | Location |
|-------|-----------|----------|
| Net worth over time | `AreaChart` | Dashboard, Analytics |
| Income vs. expenses | `LineChart` (dual line) | Dashboard, Analytics |
| Monthly spending/income | `BarChart` | Analytics |
| Category breakdown | `PieChart` (donut) | Dashboard, Spending |
| Savings rate trend | `LineChart` | Analytics |
| Portfolio value | `AreaChart` | Investments |
| Portfolio allocation | `PieChart` (donut) | Investments |

---

## Icons

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Lucide React** | latest | Icon library — clean, consistent, tree-shakeable |

### Why Lucide?

- Modern, minimal line icons that match the editorial design direction.
- Tree-shakeable — only icons actually imported are bundled.
- React components with consistent sizing and stroke-width props.
- Covers all needed icons: navigation, categories, finance, UI actions.

### Example Usage

```jsx
import { TrendingUp, Wallet, CreditCard, Search, Plus } from 'lucide-react';

<TrendingUp size={16} className="text-emerald-600" />
```

---

## Date Handling

| Technology | Version | Purpose |
|-----------|---------|---------|
| **date-fns** | 3.x | Lightweight, modular date utility library |

### Why date-fns?

- Tree-shakeable — import only the functions you use (`format`, `startOfMonth`, `subMonths`, etc.).
- Immutable — all functions return new Date objects.
- Significantly smaller bundle than Moment.js.
- Covers all requirements: formatting, month ranges, relative comparisons, iteration.

### Functions Used

| Function | Purpose |
|----------|---------|
| `format(date, 'MMM dd')` | Display dates like "Aug 10" |
| `format(date, 'MMMM yyyy')` | Display "August 2026" |
| `startOfMonth` / `endOfMonth` | Filter transactions by month |
| `subMonths` | Generate last N months for charts |
| `isWithinInterval` | Date range filtering |
| `parseISO` | Parse ISO date strings from storage |

---

## Data Persistence

| Technology | Purpose |
|-----------|---------|
| **localStorage** | Browser-native key-value storage for all user data |

### Storage Keys

| Key | Contents |
|-----|----------|
| `ledger_transactions` | JSON array of all transactions |
| `ledger_accounts` | JSON array of all accounts |
| `ledger_budgets` | JSON array of all budgets |
| `ledger_investments` | JSON array of all holdings |
| `ledger_settings` | JSON settings object |
| `ledger_initialized` | Boolean flag — prevents re-seeding mock data |

### Abstraction Layer

All localStorage access goes through `services/storage.js`, which provides:

- CRUD methods for each entity type
- Auto-generated IDs
- JSON serialisation/deserialisation
- Export (download as JSON file)
- Import (upload + validate + overwrite)
- Clear all data

This abstraction enables a future swap to Supabase, Firebase, or any REST API without changing component code.

### Limitations

- ~5–10 MB storage limit per origin (browser-dependent).
- Synchronous reads — acceptable for the expected data volume (hundreds to low thousands of transactions).
- No cross-device sync (by design for v1).

---

## Fonts (External)

| Font | Source | Usage |
|------|--------|-------|
| **Playfair Display** | Google Fonts | Display/heading typography — editorial serif |
| **Inter** | Google Fonts | Body/UI typography — clean sans-serif |

Loaded via `<link>` tags in `index.html` or `@import` in CSS. Only the weights actually used are loaded (400, 500, 600, 700).

---

## Development Tooling

| Tool | Purpose |
|------|---------|
| **Vite Dev Server** | HMR, fast refresh during development |
| **ESLint** | Code quality and consistency (optional, recommended) |
| **Prettier** | Code formatting (optional, recommended) |

### Dev Commands

```bash
npm install          # Install all dependencies
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build to /dist
npm run preview      # Preview production build locally
```

---

## What's NOT in the Stack

These technologies were explicitly excluded to keep the project lean:

| Excluded | Reason |
|----------|--------|
| **TypeScript** | Not in project scope — JS only |
| **Redux / Zustand / Jotai** | Overkill for this app size. localStorage + local state + context is sufficient. |
| **Axios / TanStack Query** | No HTTP calls — all data is local |
| **CSS-in-JS (styled-components, Emotion)** | Tailwind handles all styling needs |
| **Framer Motion** | CSS transitions are sufficient for the subtle animations required |
| **Chart.js / D3 (direct)** | Recharts provides a simpler React-native API |
| **Moment.js** | date-fns is smaller, tree-shakeable, and modern |
| **Next.js / Remix** | No SSR/SSG needed — pure client-side SPA |
| **Firebase / Supabase** | v1 is offline-first with localStorage. Backend can be added later behind the storage service abstraction. |

---

## Dependency Summary

### Production Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "recharts": "^2.x",
  "lucide-react": "latest",
  "date-fns": "^3.x"
}
```

### Dev Dependencies

```json
{
  "@vitejs/plugin-react": "^4.x",
  "vite": "^5.x",
  "tailwindcss": "^3.x or ^4.x",
  "postcss": "^8.x",
  "autoprefixer": "^10.x"
}
```

**Total production dependencies: 6**
**Total dev dependencies: 5**

The entire dependency footprint is minimal by design.

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |
| Mobile Safari (iOS) | Latest 2 versions |
| Chrome Android | Latest 2 versions |

Vite's default build target handles modern browser compatibility. No IE11 support required.
