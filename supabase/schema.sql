create table if not exists trucks (
  id uuid default gen_random_uuid() primary key,
  unit_id text not null unique,
  vin text,
  make text not null,
  model text not null,
  year integer not null,
  engine_type text,
  purchase_date date,
  purchase_price numeric(12,2),
  odometer_at_purchase integer,
  current_odometer integer,
  warranty_expiry_mileage integer,
  warranty_expiry_date date,
  eld_platform text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists maintenance_events (
  id uuid default gen_random_uuid() primary key,
  unit_id text not null references trucks(unit_id) on delete cascade,
  event_date date not null,
  shop_name text,
  invoice_total numeric(10,2) not null,
  repair_category text not null,
  mileage_at_repair integer,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_maintenance_unit_id on maintenance_events(unit_id);
create index if not exists idx_maintenance_date on maintenance_events(event_date);
