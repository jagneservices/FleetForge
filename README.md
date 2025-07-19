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
