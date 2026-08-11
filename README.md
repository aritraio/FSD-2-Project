# Ledger — Personal Finance Tracker

A production-quality, client-side personal finance dashboard built with React, Vite, Tailwind CSS, Recharts, and Lucide React. Designed with a modern private wealth management and editorial aesthetic.

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS v3 with custom design tokens (Playfair Display + Inter typography)
- **Routing**: React Router v6
- **Visualization**: Recharts 2.x
- **Icons**: Lucide React
- **Date Handling**: date-fns 3.x
- **Persistence**: `localStorage`

## Getting Started

### Prerequisites

- Node.js 18+ and `npm`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Folder Structure

```
src/
├── components/
│   ├── layout/       # App shell, Navbar, Footer
│   ├── dashboard/    # Overview cards, metric strips, summary widgets
│   ├── transactions/ # Transaction table, filters, modal forms
│   ├── budgets/      # Budget progress cards and management
│   ├── analytics/    # Deep dive reporting & trend charts
│   ├── investments/  # Asset allocation & holdings table
│   └── ui/           # Shared design system components (Button, Modal, Input)
├── pages/            # Top-level page views mapped to router
├── data/             # Mock financial seed data
├── utils/            # Currency formatting & mathematical calculations
└── services/         # Storage abstraction (localStorage CRUD)
```