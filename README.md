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
```

## Serving the App

You can deploy the static site with any static host (e.g. Netlify). To test
locally, run:

```
npx serve -s .
```

Then visit the printed URL (usually `http://localhost:3000`).

## Testing

1. Copy and configure `supabase-config.js`.
2. Create the tables and policies as shown above.
3. Start the static server and sign up for an account.
4. Add a load via `dashboard.html` and verify it appears in the log for that
   user only.
