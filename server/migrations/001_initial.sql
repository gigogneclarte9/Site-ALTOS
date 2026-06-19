create table if not exists leads (
  id uuid primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  source text not null default 'micro_audit',
  status text not null default 'new' check (
    status in ('new', 'to_contact', 'contacted', 'meeting_booked', 'won', 'lost')
  ),
  consent_accepted boolean not null default false,
  consent_text text,
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_email_idx on leads (lower(email));
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_created_at_idx on leads (created_at desc);

create table if not exists micro_audits (
  id uuid primary key,
  lead_id uuid not null references leads(id) on delete cascade,
  answers jsonb not null,
  score_total integer not null check (score_total between 0 and 30),
  score_max integer not null default 30,
  axes jsonb not null default '{}'::jsonb,
  top_axis text,
  recommendations jsonb not null default '[]'::jsonb,
  roi jsonb not null default '{}'::jsonb,
  raw_payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists micro_audits_lead_id_idx on micro_audits (lead_id);
create index if not exists micro_audits_created_at_idx on micro_audits (created_at desc);

create table if not exists documents (
  id uuid primary key,
  lead_id uuid references leads(id) on delete set null,
  micro_audit_id uuid references micro_audits(id) on delete set null,
  kind text not null check (kind in ('micro_audit_pdf', 'private_upload', 'public_asset', 'export')),
  original_filename text,
  storage_path text not null,
  mime_type text not null,
  size_bytes bigint,
  checksum_sha256 text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists documents_lead_id_idx on documents (lead_id);
create index if not exists documents_micro_audit_id_idx on documents (micro_audit_id);
create index if not exists documents_kind_idx on documents (kind);

create table if not exists lead_events (
  id uuid primary key,
  lead_id uuid not null references leads(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lead_events_lead_id_idx on lead_events (lead_id);
create index if not exists lead_events_created_at_idx on lead_events (created_at desc);

create table if not exists admin_users (
  id uuid primary key,
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin' check (role in ('admin', 'editor', 'commercial')),
  two_factor_enabled boolean not null default false,
  two_factor_secret_encrypted text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
