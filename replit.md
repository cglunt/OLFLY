# Olfly - Olfactory Training App

## Overview

Olfly is a mobile-first web application designed to help users recover their sense of smell through structured olfactory training. The app guides users through daily scent training sessions using a scientifically-backed protocol of four core scents (clove, lemon, eucalyptus, rose), with timed intervals and intensity tracking. It features progress visualization, symptom logging, and educational content about smell recovery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Development**: Hot module replacement via Vite middleware in dev mode

### Data Storage
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: users, userScents, sessions, symptomLogs, scentCollections, contactSubmissions
- **Stripe Schema**: Managed by stripe-replit-sync (products, prices, subscriptions, customers)

### Payments (Stripe)
- **Integration**: Replit Stripe connector with stripe-replit-sync for automatic webhook management
- **Products**: 
  - Free: $0 (basic training features)
  - Plus: $6.99/month (full progress history, symptom journal, custom scent library)
- **Checkout**: Stripe Checkout for subscription purchases
- **Portal**: Stripe Customer Portal for subscription management
- **Webhook**: Auto-managed by stripe-replit-sync, registered at `/api/stripe/webhook`
- **User Fields**: stripeCustomerId, plan ('free'|'plus'), plusActive (boolean), currentPeriodEnd (timestamp)

### Audio
- **Training Sounds**: Chime sound plays when smell phase begins (toggleable via Settings)
- **Sound File**: `client/src/assets/sounds/chime.mp3`
- **Attribution**: Sound by Gigi De La Ro from Pixabay (shown in Legal page)

### Key Design Patterns
- **Shared Schema**: Database types and Zod schemas in `shared/` directory accessible by both client and server
- **API Layer**: Centralized API functions in `client/src/lib/api.ts`
- **User Management**: Anonymous user creation with localStorage-based session persistence (no authentication)
- **Component Library**: Radix UI primitives wrapped with Tailwind styling via shadcn/ui

### Project Structure
```
client/src/
  ├── pages/          # Route components (Home, Training, Library, Progress, Learn)
  ├── components/     # Shared components and UI primitives
  ├── lib/            # Utilities, API functions, data constants
  └── hooks/          # Custom React hooks

server/
  ├── index.ts        # Express server entry point
  ├── routes.ts       # API route definitions
  ├── storage.ts      # Database operations layer
  ├── db.ts           # Drizzle/Neon connection
  ├── stripeClient.ts # Stripe client and sync initialization
  ├── stripeService.ts # Stripe API operations (checkout, portal)
  ├── webhookHandlers.ts # Stripe webhook event processing
  └── seed-stripe-products.ts # Script to create Stripe products

shared/
  └── schema.ts       # Drizzle schema + Zod validation
```

## External Dependencies

### Database
- **Neon Serverless Postgres**: Cloud PostgreSQL database accessed via `@neondatabase/serverless`
- **Connection**: Requires `DATABASE_URL` environment variable

### UI Components
- **Radix UI**: Full suite of accessible primitives (dialog, accordion, slider, etc.)
- **Lucide React**: Icon library
- **Recharts**: Chart library for progress visualization
- **Embla Carousel**: Carousel component

### Key Libraries
- **Drizzle ORM**: Type-safe database queries with PostgreSQL dialect
- **TanStack Query**: Data fetching and caching
- **Framer Motion**: Animation library
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation utilities

### Build & Development
- **Vite**: Frontend bundler with React and Tailwind plugins
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development