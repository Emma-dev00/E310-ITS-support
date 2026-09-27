# E310 ITS Support

Internal IT support / ticketing system for E310. Staff can report issues, and the tech team can track and resolve them.

Still very much in progress, but here's where things stand:

## What's working so far
- Login page (standard one, plus the first-time login + password reset flow for new users)
- Staff dashboard - shows "My Tickets" with status
- Report an Issue form - pick category, priority, describe the issue
- When you submit an issue it actually shows up on the dashboard now (using browser storage for now, not the real database yet)
- Database schema is set up in Prisma/Supabase - Users, Tickets, Categories, Activity Log, Equipment tables all defined

## What's not built yet
- Technical Team dashboard (the "My Assigned Tickets" / "All Tickets" view)
- Manage Users / Onboarding page for admins
- Analytics page
- Real login/authentication - right now clicking sign in just takes you to the dashboard, there's no actual auth check
- Connecting everything to the real database (still using localStorage as a placeholder)

## Roles
There are 3 roles - Staff, Technical Team, and Technical Lead/Admin. Full breakdown of what each role can see/do is in the PRD, ask me if you need it.

## Stack
- Next.js + Tailwind for frontend
- Supabase (Postgres) for the database
- Prisma as the ORM

## How to run it
cd app
npm install
npm run dev

Then go to localhost:3000/login

You'll need the `.env` file with the database keys - message me for those, I didn't push them to the repo for obvious reasons.

## Folder structure
- `app/` - the actual Next.js app, this is where the code lives
- `design-reference/` - the Stitch designs I made, just for reference, not actual code

Will keep updating this as I go. Let me know if anything doesn't run for you.