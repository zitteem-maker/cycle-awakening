-- Espace accompagnement : un enregistrement par personne (cases cochées, parts, choix du dimanche…).
-- À exécuter une fois dans Supabase → SQL Editor. Chaque personne ne lit et n'écrit que sa propre ligne (RLS).
create table if not exists public.accompagnement_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.accompagnement_state enable row level security;

create policy "accompagnement : lire sa ligne"
  on public.accompagnement_state for select
  using (auth.uid() = user_id);

create policy "accompagnement : créer sa ligne"
  on public.accompagnement_state for insert
  with check (auth.uid() = user_id);

create policy "accompagnement : modifier sa ligne"
  on public.accompagnement_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
