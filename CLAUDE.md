# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Next.js dev server on localhost:3000)
- **Build**: `npm run build` (creates production build)
- **Production server**: `npm start` (serves production build)
- **Linting**: `npm run lint` (ESLint with Next.js config)

## Architecture Overview

This is a Next.js 14 (App Router) cryptocurrency tax tracking application with the following structure:

### Tech Stack
- **Frontend**: Next.js 14 with App Router, React 18, TailwindCSS
- **Backend**: Supabase (PostgreSQL) for database and API
- **Styling**: TailwindCSS with custom color scheme (primary: #3B82F6, secondary: #10B981)
- **State Management**: React hooks (useState, useEffect)
- **Notifications**: react-toastify
- **Icons**: react-icons

### Database Schema
Two main tables in Supabase:
- `crypto_transactions`: Stores buy/sell/exchange transactions with crypto amounts, prices, dates
- `foreign_crypto_accounts`: Tracks foreign exchange accounts for French tax reporting (3916-BIS form)

### Core Components
- **src/app/page.js**: Main dashboard with tabbed interface (transactions, tax reports, foreign accounts)
- **src/components/TransactionForm.js**: Form for adding crypto transactions
- **src/components/TransactionList.js**: Display and manage transaction list
- **src/components/TaxReport.js**: Calculate and display French tax obligations
- **src/components/ForeignAccountForm.js**: Form for foreign exchange accounts
- **src/utils/taxCalculator.js**: French crypto tax calculation logic (305€ exemption, 30% tax rate)

### Key Features
- Transaction tracking (buy/sell/exchange) with automatic fiat amount calculation
- Real-time tax calculation based on French regulations
- Foreign account registration for tax compliance
- Portfolio value tracking with cost basis calculation

### Environment Variables
Requires Supabase configuration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### French Tax Compliance
The application implements French cryptocurrency taxation rules:
- 305€ annual exemption threshold
- 30% flat tax rate on gains above threshold
- FIFO (First In, First Out) cost basis calculation