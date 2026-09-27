# Internal Technical Support & Issue Management System — Stitch Design Prompts
### UI Design Brief | 10 Screens | Aligned to PRD v2 (3-Role Model)

---

## Brand Identity Reference

**Primary Colors:** Navy Blue `#0B2545`, White `#FFFFFF`, Blunt Lemon `#C9A227`
**Typography:** Clean, modern sans-serif — bold wordmark, simple and functional (this is an internal tool, not a consumer brand)
**Tone:** Efficient, clear, trustworthy — built for staff reporting issues and a technical team resolving them under time pressure
**Accent usage note:** Blunt Lemon is a muted, dulled-down lemon yellow (not a bright/neon yellow) — use it sparingly, for primary actions, active states, and key highlights, so it reads as a confident accent against the navy rather than a loud one

**Roles (per PRD Section 4 — only 3 roles exist):**
1. **Staff** — reports issues, tracks only their own tickets
2. **Technical Team (Technician)** — resolves tickets assigned to them, can view all tickets read-only
3. **Technical Lead/Admin** — one combined role; sees everything, assigns tickets, onboards users, views analytics

**⚠️ Critical instruction to repeat in every sidebar/nav prompt below:** each role must see ONLY the
nav items listed for that screen. Do not let Stitch reuse one shared "kitchen sink" sidebar across
every screen — this was a real bug in an earlier draft where Staff could see Ticket Queue, Manage
Users, and Analytics in their sidebar. Every screen prompt below explicitly states what to include
AND what to exclude for that reason.

---

---

## Login Flow Diagram (Screens 1–3)

```
                    ┌─────────────────────┐
                    │   User has an       │
                    │   account?          │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                  │
     Returning user                    Brand-new user (just
     (permanent password                onboarded by Technical
     already set)                        Lead/Admin — Screen 4)
              │                                  │
              ▼                                  ▼
   ┌─────────────────────┐          ┌─────────────────────────┐
   │ SCREEN 1             │          │ SCREEN 2                 │
   │ Standard Login        │          │ First-Time Login          │
   │ "Sign In" w/ Password │          │ "Continue" w/ Temporary    │
   │                        │          │ Password + first-login    │
   │                        │          │ banner                    │
   └──────────┬────────────┘          └──────────┬────────────────┘
              │                                  │
              │                                  ▼
              │                       ┌─────────────────────────┐
              │                       │ SCREEN 3                  │
              │                       │ Password Reset             │
              │                       │ (forced — must set a       │
              │                       │ permanent password)         │
              │                       └──────────┬────────────────┘
              │                                  │
              └────────────────┬─────────────────┘
                               ▼
                  ┌─────────────────────────┐
                  │ Role-based landing page   │
                  │ - Staff → Screen 5         │
                  │ - Technical Team → Screen 7│
                  │ - Technical Lead/Admin →   │
                  │   Screen 8                 │
                  └─────────────────────────┘
```

**Reading the diagram:** a returning user goes straight from Screen 1 into their role's
dashboard. A brand-new user is routed through Screen 2 → Screen 3 first, and only reaches their
dashboard after setting a permanent password. After that first reset, the same user always
comes back through Screen 1 on every later login — Screen 2 is a one-time detour, never a
repeat destination.

---

---

## SCREEN 1 — Login (Returning User / Standard Login)

```
Design the standard login page for an internal Technical Support & Issue Management System —
used by any of the 3 roles (Staff, Technical Team, Technical Lead/Admin) who already has a
permanent password set. Brand colors: navy blue #0B2545, white #FFFFFF, blunt lemon #C9A227 as
the accent (muted, dulled lemon yellow — not bright/neon). Font: clean modern sans-serif (e.g.
Inter or DM Sans). This is an internal company tool — efficient, calm, trustworthy, not flashy.

LAYOUT:
- Centered card, max-width 420px, white card with subtle shadow on a light gray (#F8FAFC)
  background
- Top of card: wordmark/logo placeholder — "IT Support" bold navy text with a small icon (e.g.
  a ticket or wrench icon in blunt lemon)
- Page title: "Sign In" — bold, navy
- Subtext: "Log in to report or manage technical issues" — small gray text

FORM:
- Email Address field (floating label)
- Password field (floating label, show/hide toggle icon)
- "Forgot password?" link, right-aligned, blunt lemon text
- Primary button: "Sign In" — full-width, blunt lemon background, navy text, 8px radius, bold
- No "create account" or public sign-up option anywhere on this page — all accounts, regardless
  of role, are provisioned by a Technical Lead/Admin. Show a small muted note at the bottom:
  "Don't have an account? Contact your Technical Lead/Admin to be added."

ERROR STATE:
- Red-bordered input with small red text below: "Incorrect email or password"

FOOTER:
- Small centered gray text: "Internal use only"

NOTE: after successful login, the destination screen differs by role — Staff lands on the
Staff Dashboard (Screen 5), Technical Team lands on the Technical Team Dashboard (Screen 7),
and Technical Lead/Admin lands on the All Tickets & Assignment screen (Screen 8). This login
page itself has no role-specific elements — it's shared by all three.
```

---

---

## SCREEN 2 — First-Time Login (New User / Temp Password)

```
Design the first-time login page for a newly onboarded user (any of the 3 roles) logging in
with a temporary password sent by a Technical Lead/Admin. Same layout family as the standard
login (Screen 1) so the two feel like one product, but visually distinct to signal a one-time,
setup-required sign-in. Brand: navy #0B2545, white, blunt lemon #C9A227 accent.

LAYOUT:
- Same centered card pattern as Screen 1 (max-width 420px, white card, light gray background)
- Top of card: wordmark/logo, same as standard login
- Page title: "Welcome — First-Time Sign In" — bold, navy
- Subtext: "Use the temporary password sent to your email to sign in and set up your account."
  — small gray text

BANNER:
- Prominent lemon-tinted banner directly under the subtext, navy text, key/lock icon:
  "This is your first login. You'll be asked to set a permanent password next."

FORM:
- Email Address field (floating label) — may be pre-filled if arriving via an emailed invite
  link
- Temporary Password field (floating label, show/hide toggle) — labeled explicitly "Temporary
  Password", not just "Password"
- Primary button: "Continue" — full-width, blunt lemon background, navy text, bold
  (not labeled "Sign In" — it leads straight into the password-reset step, Screen 3)

ERROR STATE:
- Red-bordered input with small red text below: "Incorrect email or temporary password. Check
  the invite email or contact your Technical Lead/Admin."

FOOTER:
- Small centered gray text: "Internal use only" + smaller link: "Already set your password?
  Go to standard Sign In →" (links back to Screen 1)
```

---

---

## SCREEN 3 — Password Reset (First Login)

```
Design the forced password reset screen shown immediately after a new user continues past the
First-Time Login screen (Screen 2). Applies to all 3 roles identically. Brand: navy #0B2545,
white, blunt lemon #C9A227 accent.

LAYOUT:
- Centered card, max-width 420px, white card on light gray background
- Icon: a simple lock/key icon in navy at the top, centered
- Title: "Set a New Password" — bold, navy
- Subtext: "For security, please set a new password before continuing." — gray, small

FORM:
- New Password field (floating label, show/hide toggle)
- Confirm New Password field (floating label)
- Password strength indicator bar below the New Password field (muted red → blunt lemon →
  green as strength increases)
- Primary button: "Set Password & Continue" — full-width, blunt lemon background, navy text

VALIDATION:
- Inline helper text under the field listing requirements (e.g. "At least 8 characters, one
  number") — turns green with a checkmark as each requirement is met

DESTINATION AFTER THIS SCREEN: role-based landing page — Staff Dashboard, Technical Team
Dashboard, or All Tickets & Assignment screen, per the account's assigned role.
```

---

---

## SCREEN 4 — Onboard New User (Technical Lead/Admin)

```
Design a dedicated full-page screen (not a modal) used by a Technical Lead/Admin to onboard a
new user into the system — this is the ONLY role that can access this screen. Brand: navy
sidebar, white content area, blunt lemon #C9A227 accent. Desktop-optimized.

SIDEBAR (Technical Lead/Admin role — 220px navy background). Include ONLY these nav items, in
this order:
- All Tickets (icon: ticket)
- Manage Users (icon: people) — ACTIVE on this screen
- Onboard New User (icon: user-plus)
- Analytics & SLA (icon: bar chart)
- Manage Categories (icon: tag)
Do NOT include "My Tickets" or "My Assigned Tickets" — those are Staff/Technical Team items and
must never appear in a Technical Lead/Admin sidebar.
Bottom of sidebar: user avatar, name, role badge "Technical Lead/Admin" (navy filled, white
text), Sign Out link.

PAGE HEADER:
- Breadcrumb: "Manage Users > Onboard New User" — small gray text
- Page title: "Onboard New User" — bold navy
- Subtext: "Create an account and this person will receive an email with instructions to sign
  in for the first time." — gray, small

FORM (centered, max-width 560px, white card with subtle border):
- Full Name — text input
- Email Address — text input, helper text below: "This is where their login invite will be
  sent"
- Role — dropdown with EXACTLY 3 options (no more, no fewer): Staff, Technical Team, Technical
  Lead/Admin. Each option shows a one-line description under it when selected:
  - Staff: "Can report issues and track only their own tickets"
  - Technical Team: "Can resolve tickets assigned to them, and view all tickets read-only"
  - Technical Lead/Admin: "Full access — can assign tickets, onboard users, view analytics"
- Department / Location (optional) — text input, useful context for the technical team

INVITE PREVIEW CARD (below the form, subtle bordered box):
- Small label: "Email Preview"
- Mock preview of the invite email: "Welcome to IT Support. Your temporary password is
  [xxxxxxx]. Sign in here to get started →" — shown in a light gray card to signal preview only

SUBMIT ROW:
- "Cancel" ghost button (navy border, navy text) — returns to Manage Users
- "Send Invite" — solid blunt lemon background, navy text, bold

CONFIRMATION STATE (after submit):
- Success state: checkmark icon in a blunt lemon circle, "Invite sent to [email]" bold navy
  text, subtext "They'll be prompted to set a permanent password on first login and will only
  see the screens for the [Role] they were assigned." — two options: "Onboard Another User"
  (blunt lemon) and "Back to Manage Users" (navy ghost)

BULK IMPORT OPTION:
- Small link near the top of the form: "Prefer to add multiple people at once? Import CSV →" —
  leads to a file-upload state (dashed upload box, "Download template" link, preview table of
  parsed rows — including their role column — before confirming import)
```

---

---

## SCREEN 5 — Staff Dashboard (My Tickets)

```
Design the Staff dashboard — this is what a Staff member sees after logging in, and it is the
ONLY ticket-related screen a Staff member can ever reach. Brand: navy header, white content
area, blunt lemon #C9A227 accent (muted, used sparingly).

TOP NAV BAR (NOT a full sidebar — Staff has a single flat page, no multi-page sidebar since they
only have one destination):
- Left: wordmark/logo ("IT Support") in navy on white background
- Right: user avatar initials circle (navy background, white initials) + name + role label
  "Staff" (small gray text) + dropdown (Profile, Sign Out)
- CRITICAL: this top nav must contain NO links to Ticket Queue, All Tickets, Manage Users,
  Onboard New User, or Analytics. A Staff account has no route to any of those pages, so no
  navigation element should imply they exist.

PAGE HEADER:
- "My Tickets" — bold navy heading, left-aligned
- Right: "+ Report an Issue" button — solid blunt lemon background, navy text, bold, prominent
  (the single most important action on this page)

STATS ROW (3 small cards):
- Open Tickets: number, navy text
- In Progress: number, blunt-lemon-tinted icon
- Resolved (this month): number, muted green icon

MY TICKETS TABLE — shows ONLY tickets this specific staff member submitted, never anyone else's:
- Columns: Ticket ID, Category (icon + label), Description (truncated), Status (colored pill),
  Date Submitted, Action
- Status pill colors: Open=gray outlined, Assigned=blue filled, In Progress=blunt lemon filled
  (navy text), Resolved=green filled, Closed=dark gray filled, Reopened=red outlined
- Action column: "View →" link in navy, turns blunt lemon on hover
- Filter row above table: dropdown for status filter, search input for ticket ID/keyword

EMPTY STATE (no tickets yet):
- Centered simple line icon (ticket/checklist), headline "No tickets yet", subtext "Report an
  issue and it'll show up here.", "+ Report an Issue" button repeated in blunt lemon

RESOLVED TICKET — CONFIRMATION BANNER (when a technician just marked one of their tickets
resolved):
- Light lemon-tinted banner at the top of the page: "Your ticket #1042 was marked resolved by
  [Technician Name]. Confirm it's fixed →" with "Confirm" (green) and "Reopen" (red ghost)
  buttons inline
```

---

---

## SCREEN 6 — Create Issue Form

```
Design the "Report an Issue" form for Staff to submit a new technical support ticket. Brand:
navy, white, blunt lemon #C9A227 accent. Simple, fast, low-friction.

LAYOUT:
- Centered card or full-width panel, max-width 640px
- Page title: "Report an Issue" — bold navy
- "← Back to My Tickets" link above the title, small gray/navy text

FORM FIELDS:
- Category — dropdown/select with icons: Computer/Laptop, Network, Printer, Account/Access,
  Software, Hardware, Other
- Priority — segmented control / pill buttons: Low, Medium, High, Urgent (Urgent shown in a
  muted red tone to stand out without alarming)
- Device / Location — text input, placeholder "e.g. Front desk printer, Room 204"
- Description — textarea, placeholder "Describe the issue in detail — what happened, when it
  started, any error messages you saw"
- Attach a photo (optional) — dashed upload box with a camera/upload icon, "Drag & drop or
  click to upload (JPG, PNG, max 5MB)"

QR CODE AUTO-FILL STATE (if arriving via QR scan on equipment):
- Light lemon-tinted banner above the form: "✓ Device detected: HP LaserJet — 2nd Floor
  Printer Room. Device & Location auto-filled below." with a small "Not this device? Clear" link
- The Device/Location field is pre-filled with a small "Auto-filled" badge in muted lemon

SUBMIT ROW:
- "Cancel" ghost button (navy border, navy text)
- "Submit Ticket" — solid blunt lemon background, navy text, bold, right-aligned

CONFIRMATION STATE (after submit):
- Full-panel success state: checkmark icon in blunt lemon circle, "Ticket #1043 submitted" bold
  navy text, "You'll be notified when a technician is assigned." subtext, "View My Tickets →"
  button — this returns to Screen 5, the Staff Dashboard, since Staff has no other destination
```

---

---

## SCREEN 7 — Technical Team Dashboard (My Assigned + All Tickets)

```
Design the Technical Team member's dashboard. Per PRD FR7 and FR13, a Technical Team member has
exactly TWO views: "My Assigned Tickets" (full edit access) and "All Tickets" (read-only). They
CANNOT assign or reassign tickets — that action belongs only to Technical Lead/Admin. Brand:
navy sidebar, white content, blunt lemon #C9A227 accent used for active states and key actions.
Desktop-optimized.

LAYOUT: Left sidebar nav (220px, navy background) + top bar + main content

LEFT SIDEBAR — Include ONLY these two items, nothing else:
- My Assigned Tickets (icon: inbox) — ACTIVE by default
- All Tickets (icon: list) — read-only view
Do NOT include: Manage Users, Onboard New User, Analytics & SLA, Manage Categories, or any
assignment tool — a Technical Team member has no access to any of those and must not see links
to them, even disabled/grayed-out ones.
Bottom of sidebar: user avatar, name, role badge "Technical Team" (blue filled, white text),
Sign Out link.

TOP BAR:
- Page title switches with the active sidebar item: "My Assigned Tickets" or "All Tickets"
- Right: search input for ticket ID/keyword, notification bell icon

"MY ASSIGNED TICKETS" VIEW (full access):
- Filter tabs: "All", "In Progress", "Urgent" — active tab underlined in blunt lemon
- Table columns: Ticket ID, Staff (name + avatar), Category, Priority (colored dot: gray=Low,
  blue=Medium, blunt lemon=High, red=Urgent), Status (pill), Age (e.g. "2h", "3d"), Action
- Clicking a row opens a Ticket Detail drawer (slides in from right, 480px):
  - Top: Ticket ID, status pill, priority, close (X) button — NO "Assign to" dropdown here,
    since this technician cannot reassign
  - Sections: Description, Attached Photo (if any), Device/Location, Reported By, Activity Log
  - Resolution notes textarea — "Add Resolution Note" button, blunt lemon
  - Status change buttons: "Start Progress" (blunt lemon) / "Mark Resolved" (green) — this
    technician can move their own ticket all the way to Resolved themselves

"ALL TICKETS" VIEW (read-only, for awareness only):
- Same table columns as above, plus an "Assigned To" column (avatar or "Unassigned" in gray)
- Every row is visually slightly muted/non-interactive compared to "My Assigned Tickets" (e.g.
  no hover-lift, no action buttons) to reinforce that this is a read-only reference view
- Clicking a row opens the same Ticket Detail drawer, but in fully read-only mode — no
  resolution notes field, no status buttons, just the description/history for context

URGENT TICKET INDICATOR:
- Tickets flagged Urgent show a small red dot/badge pulsing subtly in either view
```

---

---

## SCREEN 8 — All Tickets & Assignment (Technical Lead/Admin)

```
Design the Technical Lead/Admin's main ticket-management screen — this is where tickets get
assigned to technicians. Brand: navy sidebar, white content, blunt lemon #C9A227 accent.
Desktop-optimized.

LEFT SIDEBAR — Include ONLY these items, in this order:
- All Tickets (icon: ticket) — ACTIVE on this screen
- Manage Users (icon: people)
- Onboard New User (icon: user-plus)
- Analytics & SLA (icon: bar chart)
- Manage Categories (icon: tag)
Do NOT include "My Tickets" or "My Assigned Tickets" — this role doesn't have personal tickets
assigned to it in the same sense; it manages the whole system.
Bottom of sidebar: user avatar, name, role badge "Technical Lead/Admin" (navy filled, white
text), Sign Out link.

TOP BAR:
- Page title: "All Tickets"
- Right: search input for ticket ID/keyword, notification bell icon

FILTER BAR:
- Tabs: "All", "Unassigned", "Urgent" — active tab underlined in blunt lemon
- Dropdown filters: Status, Category, Priority, Assigned Technician

TICKET LIST — TABLE OR KANBAN VIEW (toggle at top-right: List / Board):

LIST VIEW:
- Columns: Ticket ID, Staff (name + avatar), Category, Priority (colored dot), Status (pill),
  Assigned To (avatar or "Unassigned" in gray, with an inline "Assign ▾" control if unassigned),
  Age, Action
- Row hover: light lemon-tinted background

BOARD (KANBAN) VIEW:
- Columns: Open, Assigned, In Progress, Resolved, Closed
- Column header: stage name + count badge
- Cards: Ticket ID + short description, staff name, priority dot, age badge, assigned
  technician avatar
- Drag-and-drop between columns to change status; dragging a card from "Open" into "Assigned"
  triggers an inline technician-picker

TICKET DETAIL DRAWER (slides in from right, 480px):
- Top: Ticket ID, status pill, priority, "Assign to ▾" dropdown (lists all Technical Team
  members), close (X) button
- Sections: Description, Attached Photo (if any), Device/Location, Reported By, Activity Log
- Status change buttons: "Mark Resolved" (green) / "Reassign" (navy ghost) — a Technical
  Lead/Admin can override status on any ticket

URGENT TICKET INDICATOR:
- Tickets flagged Urgent show a small red dot/badge pulsing subtly in the list
```

---

---

## SCREEN 9 — Manage Users (Technical Lead/Admin)

```
Design the Manage Users screen for a Technical Lead/Admin. Brand: navy sidebar, white content,
blunt lemon #C9A227 accent. Desktop-optimized, internal tool aesthetic.

LEFT SIDEBAR — same 5 items as Screen 8 (All Tickets, Manage Users, Onboard New User, Analytics
& SLA, Manage Categories), with "Manage Users" ACTIVE.

PAGE HEADER:
- Title: "Manage Users"
- Right: "+ Onboard New User" button — solid blunt lemon, navy text, bold — navigates to Screen
  4 rather than opening a modal

USER TABLE:
- Columns: Name + avatar initials, Email, Role (colored badge: Staff=gray, Technical Team=blue,
  Technical Lead/Admin=navy filled with white text — only 3 possible badge values), Status
  (Active / Pending — pending shown in muted amber, meaning invite sent but not yet activated),
  Date Added, Actions
- Actions: "Edit" link, "Resend Invite" link (Pending users only), "Deactivate" link (red text)
  via a kebab menu

PENDING INVITE STATE:
- Row shows "Pending" amber badge + a small "Resend Invite" link
- Hovering the badge shows a tooltip: "Invite sent 2 days ago"

DEACTIVATE CONFIRMATION MODAL:
- Title: "Deactivate User?"
- Body: "[Name] will no longer be able to log in. Their ticket history will be preserved."
- Buttons: "Cancel" ghost | "Deactivate" — red filled

ROLE FILTER:
- Dropdown above the table to filter by role: All, Staff, Technical Team, Technical Lead/Admin
```

---

---

## SCREEN 10 — Analytics & SLA Dashboard (Technical Lead/Admin)

```
Design the analytics/reporting dashboard — visible ONLY to Technical Lead/Admin, per PRD FR15.
Brand: navy sidebar, white content, blunt lemon #C9A227 as the primary chart/highlight color,
with supporting muted grays and blues for secondary data. Desktop-optimized.

LEFT SIDEBAR — same 5 items as Screen 8, with "Analytics & SLA" ACTIVE.

PAGE HEADER:
- Title: "Analytics & SLA"
- Right: date range selector — "Last 30 days ▾"

KPI CARDS ROW (4 cards):
- Total Tickets (this period): number, navy
- Avg Resolution Time: e.g. "4.2 hrs", blunt lemon accent icon
- Open vs Resolved: small horizontal split bar (blunt lemon = open, muted green = resolved)
  with percentages
- Tickets Resolved This Month: number with a small up/down trend arrow vs. previous period

CHARTS ROW (2-column):
- Left: "Tickets by Category" — horizontal bar chart, bars in navy with blunt lemon highlight
  on the top category (Computer/Laptop, Network, Printer, Account/Access, Software, Hardware,
  Other)
- Right: "Tickets Over Time" — simple line chart, navy line with blunt lemon dot markers,
  showing daily/weekly ticket volume across the selected date range

SECOND CHARTS ROW:
- Left: "Most-Reported Devices/Locations" — ranked list with small horizontal bars, e.g. "2nd
  Floor Printer Room — 14 tickets"
- Right: "Resolution Time by Technician" — horizontal bar chart, one bar per Technical Team
  member, sorted fastest to slowest, blunt lemon bar for the fastest

TABLE — SLA BREACHES (optional section):
- "Tickets Exceeding SLA" — small table listing tickets open longer than target resolution
  time, each row in a light red tint, with "View →" link

EXPORT:
- Small "Export Report" button, top-right, navy ghost button with a download icon
```

---

---

## ADDITIONAL NOTES FOR STITCH

### Consistent Component Library Across All Screens:

**Buttons:**
- Primary: `#C9A227` blunt lemon background, `#0B2545` navy text, 8px radius, 16px font, bold
- Secondary: navy outline, navy text, same sizing
- Danger: `#E74C3C` red, white text (for destructive actions like Deactivate, Reject)
- Ghost: transparent, navy border, navy text
- Success (used for "Mark Resolved" / confirm actions): muted green `#2E9E5B`, white text

**Status Pills / Badges (Ticket Status):**
- Open: `#94A3B8` gray outlined
- Assigned: `#3B82F6` blue filled
- In Progress: `#C9A227` blunt lemon filled, navy text
- Resolved: `#2E9E5B` green filled
- Closed: `#475569` dark gray filled
- Reopened: `#E74C3C` red outlined

**Priority Indicators:**
- Low: gray dot
- Medium: blue dot
- High: blunt lemon dot
- Urgent: red dot (subtle pulse animation)

**Role Badges — only 3 values exist, never more:**
- Staff: gray
- Technical Team: blue
- Technical Lead/Admin: navy filled, white text

**Typography Scale:**
- H1: 32–40px, bold (internal tool — no need for 56px marketing-scale headlines)
- H2: 24–28px, bold
- H3: 18–20px, semibold
- Body: 14–15px, regular
- Caption: 12–13px, gray

**Cards:**
- White background, 1px `#E2E8F0` border, 10px border-radius, hover shadow
  `0 4px 12px rgba(0,0,0,0.06)`

**Color Palette:**
- Navy (primary background/sidebar/text): `#0B2545`
- Blunt Lemon (primary action/accent — muted, not bright): `#C9A227`
- White (content background): `#FFFFFF`
- Light Gray (page background): `#F8FAFC`
- Text primary: `#1E2A3A`
- Text secondary: `#64748B`
- Border: `#E2E8F0`
- Success/Resolved green (supporting color, not a brand color): `#2E9E5B`
- Danger red (supporting color): `#E74C3C`

**General note:** Because Blunt Lemon is muted rather than vibrant, pair it generously with
navy and white negative space so the interface still feels calm and professional — this is an
internal operations tool, not a consumer product, so restraint matters more than visual flair.

**Role-visibility reminder (repeat this instruction when prompting Stitch for EACH screen):**
Explicitly state which of the 3 roles the screen is for, and explicitly list which sidebar/nav
items are allowed and which must be excluded. Never let Stitch carry over a sidebar from a
previous screen in the same project without re-specifying its contents — this is what caused a
Staff dashboard to incorrectly show Ticket Queue, Manage Users, and Analytics links in an
earlier draft.

---
*Prepared for: Internal Technical Support & Issue Management System*
*Adapted for Stitch (Google Labs AI UI design tool) — aligned to PRD v2 (3-role model)*
