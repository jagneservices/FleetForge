# FleetForge
FleetForge – a lightweight, modular Trucking Management System (TMS) built for dispatchers and fleet owners.

## Database Schema

Create a `loads` table in Supabase with the following columns:

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `pickup_location` (text)
- `delivery_location` (text)
- `rate` (number)
- `status` (text)
- `created_at` (timestamp)

Create a `subscriptions` table with:

- `user_id` (uuid, primary key references auth.users)
- `active` (boolean)

Create a `companies` table with:

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `company_name` (text)
- `company_email` (text)
- `phone_number` (text)
- `address` (text)
- `company_logo` (text)

Create a `users` table with:

- `id` (uuid, primary key references auth.users)
- `company_id` (uuid, foreign key to companies)
- `role` (text)

Create a `drivers` table with:

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `name` (text)
- `phone` (text)

Create an `equipment` table with:

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `type` (text)
- `identifier` (text)

Create a `rate_confirmations` table with:

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `load_id` (uuid, foreign key to loads)
- `driver_id` (uuid, foreign key to drivers)
- `confirmed_at` (timestamp)


## Authentication Setup

Copy `supabase-config.example.js` to `supabase-config.js` and add your Supabase project URL and anon key. These values are required for login and database access.

```
cp supabase-config.example.js supabase-config.js
# edit supabase-config.js with your credentials
```

## Row Level Security

Enable RLS on your tables so each user only sees their own data. Example SQL:

```sql
-- Loads table policies
alter table loads enable row level security;
create policy "Loads owned by user" on loads
  for select using (auth.uid() = user_id);
create policy "Insert own loads" on loads
  for insert with check (auth.uid() = user_id);

-- Subscriptions table policies
alter table subscriptions enable row level security;
create policy "Read own subscription" on subscriptions
  for select using (auth.uid() = user_id);
alter table companies enable row level security;
create policy "Companies owned by user" on companies
  for select using (auth.uid() = user_id);
create policy "Insert own company" on companies
  for insert with check (auth.uid() = user_id);
create policy "Update own company" on companies
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users table policies
alter table users enable row level security;
create policy "Read own profile" on users
  for select using (auth.uid() = id);
create policy "Manage own profile" on users
  for all using (auth.uid() = id)
  with check (auth.uid() = id);

-- Drivers table policies
alter table drivers enable row level security;
create policy "Drivers owned by user" on drivers
  for select using (auth.uid() = user_id);
create policy "Insert own driver" on drivers
  for insert with check (auth.uid() = user_id);

-- Equipment table policies
alter table equipment enable row level security;
create policy "Equipment owned by user" on equipment
  for select using (auth.uid() = user_id);
create policy "Insert own equipment" on equipment
  for insert with check (auth.uid() = user_id);

-- Rate confirmations table policies
alter table rate_confirmations enable row level security;
create policy "Rate confirmations owned by user" on rate_confirmations
  for select using (auth.uid() = user_id);
create policy "Insert own rate confirmation" on rate_confirmations
  for insert with check (auth.uid() = user_id);
```

## Serving the App

You can deploy the static site with any static host (e.g. Netlify). To test
locally, run:

```
npx serve -s .
```

Then visit the printed URL (usually `http://localhost:3000`).

## Testing

Automated tests use [Playwright](https://playwright.dev). Configure Supabase
and install dependencies before running them.

1. Copy `supabase-config.example.js` to `supabase-config.js` and add your
   Supabase credentials.
2. Create the tables and policies as shown above.
3. Install dependencies and Playwright browsers:

   ```bash
   npm install
   npx playwright install
   ```

4. Run the tests:

   ```bash
   npm test
   ```

The test suite starts a local server, signs up a user, registers a company, and
verifies that the user can log out and log back in without re-registering.

<!--
SQL to enable row level security scoped by company

-- enable RLS on all tables
alter table companies enable row level security;
alter table drivers enable row level security;
alter table equipment enable row level security;
alter table loads enable row level security;
alter table rate_confirmations enable row level security;
alter table users enable row level security;

-- policy: users can insert/select/update/delete rows where company.user_id = auth.uid()
create policy "manage own company" on companies
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- for companies: user can manage only row with user_id = auth.uid()
-- apply similar policy to drivers, equipment, loads, rate_confirmations and users
-- ensuring company_id exists in a company owned by the auth user
