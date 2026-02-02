# DataHeavy Dashboard

A production-grade React + TypeScript dashboard demonstrating best practices for data-intensive UIs with server-side operations, URL-synced state, and performance optimizations.

## 🎯 Features

### Core Functionality
- **📊 Dashboard Overview** - Summary cards with key metrics and interactive charts
- **📋 Orders Table** - Data-heavy table with advanced features:
  - Server-side pagination, sorting, and filtering
  - Search by customer name/email (debounced)
  - Multi-select status filter
  - Country filter
  - Date range picker with presets (7/30/90 days)
  - Column visibility toggles (persisted in localStorage)
  - Row selection with bulk CSV export
  - Responsive design
- **🔍 Order Details** - Detailed order view with line items
- **🔐 Authentication** - Fake login system with localStorage persistence
- **🔗 URL State Sync** - All table filters, pagination, and sorting reflected in URL
- **⚡ Performance** - Optimized with memoization, debouncing, and efficient re-renders

### Technical Highlights
- **Type Safety** - Full TypeScript coverage with Zod runtime validation
- **Mock API** - MSW (Mock Service Worker) with 15,000 generated orders
- **Error Handling** - Comprehensive error boundaries and retry mechanisms
- **Testing** - Unit and component tests with Vitest + Testing Library
- **Clean Architecture** - Feature-based folder structure with clear separation of concerns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Initialize MSW (Mock Service Worker)
npx msw init public/ --save

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Demo Credentials
Any email and password combination will work for the demo login.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui
```

## 📦 Building for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Tech Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** (React Query) - Server state management
- **TanStack Table** - Headless table library
- **React Router 6** - Client-side routing
- **Zod** - Schema validation
- **MSW** - API mocking
- **Vitest** - Testing framework

### Folder Structure

```
src/
├── app/                    # Application setup
│   ├── App.tsx            # Root component
│   ├── Layout.tsx         # Layout with header/footer
│   └── router.tsx         # Route definitions
├── features/              # Feature modules
│   ├── auth/             # Authentication
│   │   ├── components/   # Login form
│   │   ├── hooks/        # useAuth hook
│   │   └── types.ts      # Auth types
│   ├── dashboard/        # Dashboard overview
│   │   ├── components/   # Cards and charts
│   │   ├── api/          # Stats API
│   │   └── DashboardPage.tsx
│   └── orders/           # Orders feature
│       ├── components/   # Table, filters, detail view
│       ├── api/          # Orders API calls
│       ├── hooks/        # Query and state hooks
│       ├── schema.ts     # Zod schemas
│       └── types.ts      # TypeScript types
├── lib/                  # Shared utilities
│   ├── queryClient.ts   # React Query setup
│   ├── urlState.ts      # URL state management
│   └── utils.ts         # Helper functions
├── mocks/               # MSW mock API
│   ├── browser.ts       # Worker setup
│   ├── handlers.ts      # API handlers
│   ├── dataGenerator.ts # Data generation
│   └── db.ts           # Data types
├── components/          # Shared components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── NotFoundPage.tsx
└── main.tsx            # Entry point
```

### Key Design Decisions

#### 1. **URL State Management**
All table state (pagination, filters, sorting) is synchronized with URL query parameters. This provides:
- Shareable URLs - Users can bookmark or share specific table views
- Browser navigation - Back/forward buttons work as expected
- Persistence - State survives page refreshes

Implementation: Custom `useUrlState` hook with type-safe serialization/deserialization.

#### 2. **React Query for Server State**
TanStack Query handles all server-side data with:
- Automatic background refetching
- Request deduplication
- Optimistic updates
- Built-in loading/error states
- Cache management

#### 3. **TanStack Table for Data Grid**
Headless table library provides:
- Column visibility control
- Row selection
- Flexible rendering
- TypeScript support
- No UI opinions (we control styling)

#### 4. **MSW for API Mocking**
Mock Service Worker intercepts network requests at the browser level:
- No changes needed between mock and real API
- Realistic network latency
- Deterministic data generation (15,000 orders)
- Error simulation capabilities

#### 5. **Feature-Based Architecture**
Code organized by feature (auth, orders, dashboard) rather than by type (components, hooks):
- Better scalability
- Easier to understand
- Clearer boundaries
- Simpler imports

## 🎨 Performance Optimizations

1. **Memoization** - Table columns and callbacks are memoized to prevent unnecessary re-renders
2. **Debounced Search** - Search input debounced by 300ms to reduce API calls
3. **Stable Query Keys** - React Query keys structured for optimal caching
4. **Lazy Loading** - Routes are code-split for faster initial load
5. **Local Storage** - Column visibility persisted to avoid recalculation

## 🧩 Key Components

### OrdersTable
The core data table component with:
- Column sorting (createdAt, total, customerName)
- Row selection with bulk actions
- Column visibility toggles
- CSV export functionality
- Pagination controls
- Empty state handling

### OrdersFilters
Comprehensive filter panel with:
- Debounced text search
- Multi-select status filter
- Country dropdown
- Date range picker with presets
- Reset all filters button

### useUrlState Hook
Generic hook for URL state synchronization:
```typescript
const { params, setParam, setParams, resetParams } = useUrlState({
  page: { default: 1, serialize: String, deserialize: Number },
  status: { default: [], serialize: (v) => v.join(','), deserialize: (v) => v.split(',') }
});
```

## 📊 Mock Data

The mock API generates 15,000 orders with:
- Deterministic seeded random generation
- Realistic customer names and emails
- Orders spanning the last 90 days
- 5 status types (pending, paid, shipped, cancelled, refunded)
- Multiple currencies (USD, EUR)
- 15 different countries
- Line items (1-5 per order)

## 🔧 Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests
npm run test:ui  # Run tests with UI
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

## 🚦 Testing Strategy

1. **Unit Tests** - Pure functions (utils, data generation)
2. **Hook Tests** - Custom hooks (useUrlState)
3. **Component Tests** - UI components with mock data
4. **Integration Tests** - User flows with MSW

Example test coverage:
- URL state serialization/deserialization
- Data generator determinism
- Table rendering with loading/error/empty states
- Filter interactions updating URL

## 📝 Environment Variables

No environment variables required. The app uses MSW for all API calls in development.

For production, replace MSW handlers with real API endpoints in the feature API files.

## 🤝 Contributing

This is a demo project showcasing frontend patterns. Key areas for extension:
- Add virtualization for very large tables (react-window)
- Implement real backend API
- Add more chart types (pie, bar, line)
- Expand test coverage
- Add accessibility improvements (ARIA labels, keyboard navigation)

## 📄 License

MIT

---

## 🎓 Learning Resources

This project demonstrates:
- **State Management**: URL-synced state, React Query, local storage
- **Performance**: Memoization, debouncing, efficient re-renders
- **Type Safety**: TypeScript + Zod runtime validation
- **Testing**: Vitest + Testing Library patterns
- **Architecture**: Feature-based structure, separation of concerns

Perfect for learning production-grade React patterns and best practices for data-intensive applications.