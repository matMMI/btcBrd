# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Next.js dev server on localhost:3000)
- **Build**: `npm run build` (creates production build)
- **Production server**: `npm start` (serves production build)
- **Linting**: `npm run lint` (ESLint with Next.js config)

## Architecture Overview

This is a Next.js 14 (App Router) cryptocurrency tax tracking application for French tax compliance.

### Tech Stack
- **Framework**: Next.js 14 with App Router, React 18
- **Database**: Supabase (PostgreSQL) with Supabase Auth
- **Styling**: TailwindCSS with shadcn/ui components (Radix UI primitives)
- **UI Libraries**: react-icons, lucide-react, class-variance-authority, clsx, tailwind-merge
- **Notifications**: react-toastify
- **Date handling**: date-fns

### Database Schema
Two main tables in Supabase:
- `crypto_transactions`: Stores transaction records with fields: date, type (buy/sell/received/exchange), crypto_symbol, crypto_amount, fiat_amount, fiat_currency, exchange_platform, notes
- `foreign_crypto_accounts`: Tracks foreign exchange accounts with fields: platform_name, platform_country, account_type, is_active

### Application Structure

#### Main Page (`src/app/page.js`)
- Client-side authentication flow with Supabase Auth (password-based, fixed email)
- Public dashboard view for unauthenticated users
- Admin dashboard with two tabs: "Dashboard & Transactions" and "Comptes à l'étranger"
- Real-time Bitcoin price fetching (every 20 seconds via `/api/bitcoin-price`)
- Portfolio calculations: total invested, current value, profit/loss, and 30% flat tax

#### API Routes
- `/api/bitcoin-price/route.js`: Fetches BTC/EUR price from CoinGecko API with no-cache headers

#### Key Components
- **AdminModal**: Password authentication modal (uses hardcoded email: mathis.togni@sfr.fr)
- **PublicDashboard**: Public view with limited features
- **TransactionModal**: Modal form for adding new transactions
- **EditTransactionModal**: Modal for editing existing transactions
- **TransactionList**: Displays and manages transaction list
- **DashboardCards**: 4-card dashboard showing: Bitcoin price, total invested, current value with profit/loss, and flat tax (30%)
- **ForeignAccountForm**: Form for registering foreign exchange accounts
- **DeleteModal**: Confirmation modal for deletions

#### UI Components (`src/components/ui/`)
- Built with Radix UI primitives and styled with Tailwind
- Components: badge, button, card, dialog, input
- `src/lib/utils.js`: Contains `cn()` helper for merging Tailwind classes

### Key Features & Calculations

**Transaction Types**:
- `buy`: Paid purchases (counted in total invested)
- `sell`: Sales (decreases portfolio balance)
- `received`: Free/gifted crypto (not counted in invested amount but tracked separately)
- `exchange`: Crypto-to-crypto exchanges

**Portfolio Calculations** (`src/app/page.js:40-70`):
- Total Invested: Sum of fiat amounts from paid purchases only (type === "buy" && fiat_amount > 0)
- Total Bitcoin: Running balance (buy/received - sell)
- Total Received: Separate tracking of free/gifted satoshis
- Current Value: Total balance × current BTC price
- Profit/Loss: Current value - Total invested
- Flat Tax: 30% of gains (displayed separately with "for me" amount at 70%)

**Bitcoin Price**:
- Fetched from CoinGecko API every 20 seconds
- Displayed in EUR with proper locale formatting
- Used for real-time portfolio valuation

### Authentication
- Supabase Auth with password-based login
- Fixed email: mathis.togni@sfr.fr (hardcoded in AdminModal)
- Public/private view separation based on auth state

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### French Tax Compliance
The application implements French cryptocurrency taxation:
- 30% flat tax rate on capital gains
- Displays tax owed and net profit after tax
- Tracks foreign accounts for 3916-BIS form compliance
- All calculations in EUR