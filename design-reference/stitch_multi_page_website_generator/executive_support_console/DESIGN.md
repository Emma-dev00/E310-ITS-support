---
name: Executive Support Console
colors:
  surface: '#f8f9ff'
  surface-dim: '#cedbf0'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d7e3f9'
  on-surface: '#101c2c'
  on-surface-variant: '#44474e'
  inverse-surface: '#253141'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#495f82'
  primary: '#001026'
  on-primary: '#ffffff'
  primary-container: '#0b2545'
  on-primary-container: '#778db2'
  inverse-primary: '#b1c7f0'
  secondary: '#755b00'
  on-secondary: '#ffffff'
  secondary-container: '#fed255'
  on-secondary-container: '#735a00'
  tertiary: '#000f2b'
  on-tertiary: '#ffffff'
  tertiary-container: '#002353'
  on-tertiary-container: '#4489fd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b1c7f0'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#314769'
  secondary-fixed: '#ffe08e'
  secondary-fixed-dim: '#ecc246'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f8f9ff'
  on-background: '#101c2c'
  surface-variant: '#d7e3f9'
typography:
  headline-xl:
    fontFamily: DM Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: DM Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: DM Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: DM Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  caption:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an authoritative, focused console environment for technical support operations, incident response, and tier-escalation triage. It balances institutional rigor with operational velocity: operators process critical incident queues without visual fatigue, while team leads monitor SLA adherence through a refined, executive lens.

The visual style blends **Corporate Modern** with a **Precision Console Aesthetic**. Structural chrome anchors the screen in deep navy, while operational surfaces remain airy, luminous, and scannable. Restraint governs every pixel: color is never decorative; it strictly communicates triage states, operational severity, and ownership. The overall tone is calm, precise, objective, and impeccably organized.

## Colors

The palette establishes an authoritative visual hierarchy designed for high data density and low cognitive strain:

- **Primary Chrome (`#0B2545`):** Deep Navy anchors navigation bars, primary headers, modal chrome, and administrative badges. It conveys stability, technical command, and institutional security.
- **Accent Highlight (`#C9A227`):** Blunt Lemon serves as a surgical accent. Because of its muted, desaturated character, it avoids the hyperactive alert tone of neon yellow. It is reserved for high-leverage interactive triggers, active tab indicators, and primary commit actions.
- **Support Surfaces & Borders:** Canvases use crisp Light Gray (`#F8FAFC`) with cards and paneling resting on pure White (`#FFFFFF`). Spatial separations rely on hairline Slate borders (`#E2E8F0`).
- **Typography Tone:** High-contrast Navy Slate (`#1E2A3A`) for primary headings and critical readouts, balanced with Muted Slate (`#64748B`) for secondary metadata, timestamps, and descriptive labels.

### Operational Semantic Tokens
- **Resolved / Stable (`#2E9E5B`):** Closed tickets, healthy node states, verified resolutions.
- **Critical / Urgent (`#E74C3C`):** P0/P1 incidents, SLA breach alerts, destructive actions.
- **Assigned / In Progress (`#3B82F6`):** Technical ownership, active investigation, diagnostic states.
- **Unassigned / Open (`#94A3B8`):** Pending triage, parked tickets, neutral lifecycle stages.

## Typography

The type system pairs **DM Sans** for headings with **Hanken Grotesk** for structured content and telemetry:

- **Headlines (DM Sans):** Compact, geometric proportions lend an executive presence to board-level metrics, ticket IDs, and system modules. The tight vertical tracking keeps dashboard headers dense without clutter.
- **Body & Data Labels (Hanken Grotesk):** Engineered for tabular scanability and fast data ingestion. Its balanced aperture and clear distinctions between glyphs prevent misinterpretation of code snippets, error codes, and server hostnames.
- **Pacing & Line Height:** Line heights are deliberately restrained (`1.35` to `1.45`) across operational data tables and ticket timelines to maximize vertical information density while preventing visual collisions.

## Layout & Spacing

The layout philosophy adheres to a structured, data-first **12-column fluid grid** flanked by persistent operational sidebars:

- **Canvas Organization:** A fixed 260px navigation bar on the left accommodates deep console navigation. The central workspace dynamically spans remaining space with responsive margins (`margin-mobile` at 16px, scaling to `margin` at 24px on desktop).
- **Data Grids:** Ticket tables, incident lists, and diagnostic summaries run on consistent 16px (`gutter`) column separations to preserve scan corridors across horizontal data rows.
- **Vertical Rhythm:** Components adhere to strict 4px/8px incremental spacing. Internal card padding defaults to `space-md` (16px) for high-density monitors and `space-lg` (24px) for executive summary views.
- **Breakpoints:**
  - `Mobile (<768px)`: Navigation folds into a top header; columns collapse to a 4-column stack.
  - `Tablet (768px - 1024px)`: 8-column layout; secondary panels convert to dismissible sheets.
  - `Desktop (>1024px)`: Standard 12-column split with multi-pane triage workflows enabled.

## Elevation & Depth

Depth is established primarily through **structured structural borders and crisp tonal layers**, rather than heavy drop shadows:

- **Border Architecture:** All cards, panels, and data sections feature a hairline `1px solid #E2E8F0` border. This maintains sharp boundaries on high-DPI displays and retains clarity in complex grid layouts.
- **Layer 0 (Canvas Base):** Page canvas is styled in `#F8FAFC`.
- **Layer 1 (Card & Module Resting):** Pure `#FFFFFF` surfaces with subtle, crisp ambient shadowing: `0 1px 3px 0 rgba(11, 37, 69, 0.05), 0 1px 2px -1px rgba(11, 37, 69, 0.05)`.
- **Layer 2 (Interactive Hover & Flyouts):** Used for elevated cards, dropdown menus, and popovers: `0 4px 6px -1px rgba(11, 37, 69, 0.08), 0 2px 4px -2px rgba(11, 37, 69, 0.04)`.
- **Layer 3 (Overlays & Critical Modals):** Used for ticket resolution confirmations and incident escalations: `0 20px 25px -5px rgba(11, 37, 69, 0.12), 0 8px 10px -6px rgba(11, 37, 69, 0.06)`, framed with a semi-opaque backdrop blur (`rgba(11, 37, 69, 0.4)`).

## Shapes

The design system uses a calibrated roundedness level of **2** (0.5rem / 8px baseline) to cultivate a precise, modern software aesthetic:

- **Primary Cards & Containers:** Standard 8px (`rounded`) corner radius. This softens technical density without appearing playful or consumer-oriented.
- **Modals & Flyout Sheets:** Scaled to 12px–16px (`rounded-lg` / `rounded-xl`) to establish distinct spatial separation from foundational layout blocks.
- **Controls & Inputs:** Form fields, filter bars, and primary buttons standardise on an 8px radius for physical consistency with parent cards.
- **Status Badges & Chips:** Small indicators retain full pill geometry (9999px) to immediately signal discrete, click-target or categorical badge data.

## Components

### Buttons
- **Primary Action (Blunt Lemon Accent):** Background `#C9A227`, text `#FFFFFF` (or deep `#0B2545` for high-contrast accessibility), 8px border radius, font `label-md`. Used exclusively for commits, ticket approvals, and resolution triggers.
- **Secondary (Navy Chrome):** Background `#0B2545`, text `#FFFFFF`. Used for system navigation, filtering queries, and primary creation events.
- **Outline / Neutral:** Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#1E2A3A`. Hover: background `#F8FAFC`, border `#CBD5E1`.
- **Destructive:** Background `#E74C3C`, text `#FFFFFF`. Hover: background `#C0392B`. Reserved for ticket rejections, escalations, and system rollbacks.

### Role Badges
- **Staff:** Soft slate background (`#F1F5F9`), text `#64748B`, border `1px solid #E2E8F0`.
- **Technical Team:** Soft azure background (`#EFF6FF`), text `#3B82F6`, border `1px solid #BFDBFE`.
- **Technical Lead / Admin:** Solid Navy fill (`#0B2545`), crisp white text (`#FFFFFF`), bold styling, no border.

### Status Pills
- Compact, fully rounded pills (padding `2px 8px`, `label-sm` uppercase tracking).
- **Open:** Background `#F1F5F9`, text `#94A3B8`.
- **Assigned:** Background `#EFF6FF`, text `#3B82F6`.
- **Resolved:** Background `#ECFDF5`, text `#2E9E5B`.
- **Critical / SLA Breach:** Background `#FEF2F2`, text `#E74C3C`.

### Form Fields & Inputs
- Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#1E2A3A`, border-radius 8px.
- Internal padding `10px 14px`.
- Focus state: Border color `#0B2545` with a subtle `0 0 0 1px #0B2545` ring.
- Error state: Border color `#E74C3C` with supporting text in `#E74C3C`.

### Incident & Ticket Cards
- Pure white background (`#FFFFFF`), border `1px solid #E2E8F0`, 8px corner radius.
- Header row organizes Ticket ID in bold monoline `Hanken Grotesk`, priority tag right-aligned, and inline assignment badges.
- Hover transition features subtle elevation lift and border tinting (`#CBD5E1`).

### Lists & Data Tables
- Header: `#F8FAFC` background, text `#64748B`, uppercase `label-sm`, bottom border `1px solid #E2E8F0`.
- Row height: 48px baseline for high density. Alternate striping is avoided; rows delineate using soft bottom borders (`#F1F5F9`) and hover fills (`#F8FAFC`).