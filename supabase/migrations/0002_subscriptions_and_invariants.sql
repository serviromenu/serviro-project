-- Serviro: manual subscription model and core invariants.
-- Apply after validating existing duplicate user_id/slug values.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  plan_type text not null check (plan_type in ('monthly', 'yearly')),
  status text not null default 'active'
    check (status in ('pending', 'active', 'expired', 'suspended')),
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  payment_method text not null default 'card_to_card'
    check (payment_method = 'card_to_card'),
  payment_reference text,
  admin_note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_valid_period check (expires_at > starts_at)
);

create index if not exists subscriptions_restaurant_idx
  on public.subscriptions (restaurant_id, expires_at desc);

create unique index if not exists subscriptions_one_open_per_restaurant_idx
  on public.subscriptions (restaurant_id)
  where status in ('pending', 'active');

-- These indexes intentionally fail if duplicate data exists; clean duplicates first.
create unique index if not exists restaurants_one_per_user_idx
  on public.restaurants (user_id);

create unique index if not exists restaurants_slug_unique_idx
  on public.restaurants (lower(slug));

alter table public.subscriptions enable row level security;

-- Until the Owner role is introduced, restaurant users can only see their own history.
create policy "Restaurant owners can view own subscriptions"
on public.subscriptions
for select
to authenticated
using (
  exists (
    select 1 from public.restaurants r
    where r.id = subscriptions.restaurant_id
      and r.user_id = (select auth.uid())
  )
);

-- Public menu gate: exposes only a boolean, never subscription details.
create or replace function public.is_restaurant_active(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subscriptions s
    where s.restaurant_id = p_restaurant_id
      and s.status = 'active'
      and s.starts_at <= now()
      and s.expires_at > now()
  );
$$;

revoke all on function public.is_restaurant_active(uuid) from public;
grant execute on function public.is_restaurant_active(uuid) to anon, authenticated;
