-- Smartbiz Admin - PostgreSQL Schema (Neon-ready)
-- Safe to run multiple times due to IF NOT EXISTS and ON CONFLICT
-- Note: Unquoted identifiers are folded to lowercase in Postgres

-- USERS
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INVENTORY
CREATE TABLE IF NOT EXISTS public.inventory (
  id SERIAL PRIMARY KEY,
  item_name TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROOMS (KOS)
CREATE TABLE IF NOT EXISTS public.rooms (
  id SERIAL PRIMARY KEY,
  room_name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  facilities TEXT,
  availability BOOLEAN NOT NULL DEFAULT TRUE,
  tenant_name TEXT,
  tenant_phone TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  occupation TEXT,
  payment_status_current_month TEXT NOT NULL DEFAULT 'Belum Bayar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PEMBAYARAN KOS (monthly payments per room)
CREATE TABLE IF NOT EXISTS public.pembayaran_kos (
  id SERIAL PRIMARY KEY,
  penghuni_id INTEGER NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  bulan_tagihan TEXT NOT NULL, -- format 'YYYY-MM'
  jumlah_bayar NUMERIC(12,2) NOT NULL,
  tanggal_pembayaran_lunas DATE,
  status_pembayaran TEXT NOT NULL CHECK (status_pembayaran IN ('Belum Bayar','Pending Verifikasi','Lunas')),
  metode_pembayaran TEXT, -- e.g., 'Cash', 'QRIS', 'Transfer'
  catatan_pembayaran TEXT,
  bukti_transfer_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pembayaran_kos_penghuni_bulan
  ON public.pembayaran_kos(penghuni_id, bulan_tagihan);

-- TRANSACTIONS (income/expense ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  category TEXT,
  payment_method TEXT,
  created_by INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_created_at
  ON public.transactions(created_at DESC);

-- COFFEE SHOP TABLES
CREATE TABLE IF NOT EXISTS public.menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  category TEXT,
  description TEXT,
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available','unavailable')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  total_price NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OPTIONAL: seed minimal data (commented out)
-- INSERT INTO public.users (username, password, role)
-- VALUES ('admin', '$2b$10$REPLACE_WITH_BCRYPT_HASH', 'superadmin')
-- ON CONFLICT (username) DO NOTHING;
