create extension if not exists "uuid-ossp";

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.gastosanuales_deudas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'MXN',
  category text,
  frequency text not null default 'monthly',
  due_day_type text not null default 'end_of_month',
  custom_due_day integer,
  start_date date not null,
  end_date date,
  total_installments integer,
  paid_installments integer not null default 0,
  alert_threshold_days integer not null default 5,
  status text not null default 'pending',
  autopay boolean not null default false,
  tags text[],
  household_member text,
  next_due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gastosanuales_deudas_status
  on public.gastosanuales_deudas (status);

create trigger trg_gastosanuales_deudas_updated_at
before update on public.gastosanuales_deudas
for each row
execute procedure public.update_updated_at_column();

create table if not exists public.gastosanuales_pagos (
  id uuid primary key default uuid_generate_v4(),
  debt_id uuid references public.gastosanuales_deudas(id) on delete cascade,
  amount numeric(12, 2) not null,
  scheduled_for date not null,
  paid_at timestamptz,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gastosanuales_pagos_debt_id
  on public.gastosanuales_pagos (debt_id);

create trigger trg_gastosanuales_pagos_updated_at
before update on public.gastosanuales_pagos
for each row
execute procedure public.update_updated_at_column();

create table if not exists public.gastosanuales_recordatorios (
  id uuid primary key default uuid_generate_v4(),
  debt_id uuid references public.gastosanuales_deudas(id) on delete cascade,
  fire_at timestamptz not null,
  kind text not null default 'upcoming',
  message text not null,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.gastosanuales_increment_instalment(debt_identifier uuid)
returns void
language plpgsql
as $$
begin
  update public.gastosanuales_deudas
  set paid_installments = coalesce(paid_installments, 0) + 1,
      status = case
        when total_installments is not null and paid_installments + 1 >= total_installments then 'paid'
        else status
      end,
      updated_at = now()
  where id = debt_identifier;
end;
$$;
