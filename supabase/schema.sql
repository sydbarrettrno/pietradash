-- Painel Pietra - schema inicial para dados reais
-- Execute este arquivo no SQL Editor do Supabase.
-- As políticas abaixo liberam leitura/escrita para o protótipo conectado por anon key.
-- Antes de operação multiusuário, substitua por regras baseadas em autenticação e vínculo com a obra.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.obras (
  id text primary key,
  nome text not null,
  endereco text not null default '',
  inicio date not null,
  prazo_previsto date not null,
  cliente text not null default '',
  responsavel text not null default '',
  avanco_planejado numeric(6, 2) not null default 0 check (avanco_planejado between 0 and 100),
  desvio_prazo_dias integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.disciplinas (
  id text primary key,
  obra_id text not null references public.obras(id) on delete cascade,
  nome text not null,
  responsavel text not null default '',
  meta numeric(6, 2) not null default 100 check (meta >= 0),
  produtividade numeric(8, 3) not null default 1,
  proximo_passo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.itens_controle (
  id text primary key,
  obra_id text not null references public.obras(id) on delete cascade,
  codigo text not null,
  nome text not null,
  disciplina_id text not null references public.disciplinas(id) on delete cascade,
  orcamento_previsto numeric(14, 2) not null default 0 check (orcamento_previsto >= 0),
  tendencia_custo numeric(14, 2) not null default 0 check (tendencia_custo >= 0),
  status text not null default 'ok' check (status in ('ok', 'atencao', 'critico')),
  data_prevista date not null,
  responsavel text not null default '',
  avanco_fisico numeric(6, 2) not null default 0 check (avanco_fisico between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (obra_id, codigo)
);

create table if not exists public.pendencias (
  id text primary key,
  obra_id text not null references public.obras(id) on delete cascade,
  tipo text not null check (tipo in ('Restrição', 'RFI', 'Mudança', 'Risco', 'Issue', 'Decisão')),
  disciplina_id text not null references public.disciplinas(id) on delete cascade,
  descricao text not null,
  responsavel text not null default '',
  prazo date not null,
  impacto text not null default 'Médio' check (impacto in ('Alto', 'Médio', 'Baixo')),
  status text not null default 'Aberta' check (status in ('Aberta', 'Em análise', 'Resolvida')),
  prioridade text not null default 'P2' check (prioridade in ('P1', 'P2', 'P3')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diarios (
  id text primary key,
  obra_id text not null references public.obras(id) on delete cascade,
  data date not null,
  disciplina_id text not null references public.disciplinas(id) on delete cascade,
  item_controle_id text not null references public.itens_controle(id) on delete cascade,
  atividade text not null,
  meta_dia text not null default '',
  realizado_dia text not null default '',
  equipe integer not null default 0 check (equipe >= 0),
  hh numeric(10, 2) not null default 0 check (hh >= 0),
  restricao text not null default '',
  status_dia text not null default 'ok' check (status_dia in ('ok', 'atencao', 'critico')),
  avanco_item numeric(6, 2) not null default 0 check (avanco_item between 0 and 100),
  plano_seguinte text not null default '',
  observacoes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pietra_settings (
  id text primary key default 'default',
  active_obra_id text references public.obras(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists disciplinas_obra_id_idx on public.disciplinas(obra_id);
create index if not exists itens_controle_obra_id_idx on public.itens_controle(obra_id);
create index if not exists itens_controle_disciplina_id_idx on public.itens_controle(disciplina_id);
create index if not exists pendencias_obra_id_idx on public.pendencias(obra_id);
create index if not exists pendencias_status_prioridade_idx on public.pendencias(status, prioridade);
create index if not exists diarios_obra_data_idx on public.diarios(obra_id, data desc);

drop trigger if exists set_obras_updated_at on public.obras;
create trigger set_obras_updated_at before update on public.obras
for each row execute function public.set_updated_at();

drop trigger if exists set_disciplinas_updated_at on public.disciplinas;
create trigger set_disciplinas_updated_at before update on public.disciplinas
for each row execute function public.set_updated_at();

drop trigger if exists set_itens_controle_updated_at on public.itens_controle;
create trigger set_itens_controle_updated_at before update on public.itens_controle
for each row execute function public.set_updated_at();

drop trigger if exists set_pendencias_updated_at on public.pendencias;
create trigger set_pendencias_updated_at before update on public.pendencias
for each row execute function public.set_updated_at();

drop trigger if exists set_diarios_updated_at on public.diarios;
create trigger set_diarios_updated_at before update on public.diarios
for each row execute function public.set_updated_at();

drop trigger if exists set_pietra_settings_updated_at on public.pietra_settings;
create trigger set_pietra_settings_updated_at before update on public.pietra_settings
for each row execute function public.set_updated_at();

alter table public.obras enable row level security;
alter table public.disciplinas enable row level security;
alter table public.itens_controle enable row level security;
alter table public.pendencias enable row level security;
alter table public.diarios enable row level security;
alter table public.pietra_settings enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on
  public.obras,
  public.disciplinas,
  public.itens_controle,
  public.pendencias,
  public.diarios,
  public.pietra_settings
to anon, authenticated;

drop policy if exists "prototype public access" on public.obras;
create policy "prototype public access" on public.obras for all using (true) with check (true);

drop policy if exists "prototype public access" on public.disciplinas;
create policy "prototype public access" on public.disciplinas for all using (true) with check (true);

drop policy if exists "prototype public access" on public.itens_controle;
create policy "prototype public access" on public.itens_controle for all using (true) with check (true);

drop policy if exists "prototype public access" on public.pendencias;
create policy "prototype public access" on public.pendencias for all using (true) with check (true);

drop policy if exists "prototype public access" on public.diarios;
create policy "prototype public access" on public.diarios for all using (true) with check (true);

drop policy if exists "prototype public access" on public.pietra_settings;
create policy "prototype public access" on public.pietra_settings for all using (true) with check (true);
