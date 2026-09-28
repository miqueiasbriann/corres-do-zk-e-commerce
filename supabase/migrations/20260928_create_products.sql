create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price numeric not null default 0,
  category text not null,
  image text,
  images jsonb not null default '[]'::jsonb,
  drop_name text,
  stock integer not null default 0,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public products read"
  on public.products
  for select
  using (true);
