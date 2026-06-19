create table if not exists lead_notes (
  id uuid primary key,
  lead_id uuid not null references leads(id) on delete cascade,
  admin_user_id uuid references admin_users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_notes_lead_id_idx on lead_notes (lead_id);
create index if not exists lead_notes_created_at_idx on lead_notes (created_at desc);
