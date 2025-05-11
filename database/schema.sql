-- database/schema.sql
-- Créer la table des transactions crypto
create table crypto_transactions (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  type varchar(10) not null check (type in ('buy', 'sell', 'exchange')),
  crypto_symbol varchar(10) not null,
  crypto_amount decimal(20,8) not null,
  price_per_unit decimal(10,2) not null,
  fiat_amount decimal(10,2) not null,
  fiat_currency varchar(3) default 'EUR',
  exchange_platform varchar(50),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Créer la table des comptes crypto à l'étranger (pour formulaire 3916-BIS)
create table foreign_crypto_accounts (
  id uuid default gen_random_uuid() primary key,
  platform_name varchar(100) not null,
  platform_country varchar(100) not null,
  account_type varchar(50),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Créer les indexes pour optimiser les requêtes
create index idx_crypto_transactions_date on crypto_transactions(date);
create index idx_crypto_transactions_type on crypto_transactions(type);
create index idx_crypto_transactions_crypto_symbol on crypto_transactions(crypto_symbol);