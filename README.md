# FleetForge
FleetForge – a lightweight, modular Trucking Management System (TMS) built for dispatchers and fleet owners.

## Database Schema

All application data is scoped to the authenticated user. Each table
includes a `user_id` column referencing `auth.users(id)`. The key tables
are:

### `loads`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to `auth.users`)
- `pickup_location` (text)
- `delivery_location` (text)
- `rate` (number)
- `status` (text)
- `created_at` (timestamp)

### `dispatches`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to `auth.users`)

### `drivers`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to `auth.users`)

### `carriers`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to `auth.users`)

### `equipment`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to `auth.users`)

### `rate_confirmations`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to `auth.users`)

### `expenses`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to `auth.users`)

### `subscriptions`

- `user_id` (uuid, primary key references `auth.users`)
- `active` (boolean)

Row level security (RLS) is enabled on all tables. Policies ensure users
can only read or modify rows where `user_id` matches their authenticated
`auth.uid()`. An example SQL script that creates the tables and
policies is provided in `supabase/schema.sql`.

## Authentication Setup

Copy `supabase-config.example.js` to `supabase-config.js` and add your Supabase project URL and anon key. These values are required for login and database access.

```
cp supabase-config.example.js supabase-config.js
# edit supabase-config.js with your credentials
```

