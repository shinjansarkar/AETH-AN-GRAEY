alter table if exists public.orders
  add column if not exists transaction_id text;

create index if not exists orders_transaction_id_idx on public.orders (transaction_id);