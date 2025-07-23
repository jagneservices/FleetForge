-- Adds logo_url column to companies table if it doesn't exist
create or replace function add_logo_url_column()
returns void
language plpgsql
as $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'companies'
      and column_name = 'logo_url'
  ) then
    alter table public.companies add column logo_url text;
  end if;
end;
$$;
