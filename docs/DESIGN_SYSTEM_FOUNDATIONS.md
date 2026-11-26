# Bolt Design System — Foundations & Component Manifest

This document records all foundations, tokens, Figma node IDs, and component token contracts extracted from the official **Bolt | Design System** file (`R4SLa0NOU3UHMfnEFJJmxp`). For agent usage rules, variant selection flowcharts, and code examples, start at [`DESIGN.md`](../DESIGN.md).

---

## 1. Figma Source File

* **File Name:** `Bolt | Design System`
* **File Key:** `R4SLa0NOU3UHMfnEFJJmxp`
* **Team:** Ashik Mathew Tharakan's team
* **Base URL:** `https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System`

---

## 2. Foundation Pages & Nodes

| Foundation | Figma Page / Node ID | Direct URL | Description |
| :--- | :--- | :--- | :--- |
| **Color Palette** | Page `5:10` / Node `5:526` | [View Node 5:526](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=5-526) | `colors` collection (83 vars): Primary, Neutral, Success, Warning, Error, Info 50–900 + Shade + Semantics |
| **Typography (Typescale)** | Page `18:739` / Node `32:2825` | [View Node 32:2825](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=32-2825) | `typography` collection (24 vars) + 12 Figma text styles (+ `.text-style-heading-4` in code) |
| **Spatial Tokens** | Page `51:266` / Node `57:267` | [View Node 57:267](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=57-267) | `spacing` collection (16 vars): `0x`, `x-4` (1px), `x-2` (2px), `1x`–`20x` (4px to 80px) |
| **Border Radius & Width** | Page `60:379` | [View Page 60:379](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=60-379) | `border-radius` (8 vars: `none` to `max`) & `border-width` (`thin`: 1px, `thick`: 2px) |
| **Elevation & Opacity** | Page `63:478` | [View Page 63:478](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=63-478) | `elevation` (12 vars) + Effect styles `elevation-sm`, `elevation-md`, `elevation-lg` |
| **Icons** | Page `92:701` | [View Page 92:701](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=92-701) | `icon` collection (4 vars): `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px) |

---

## 3. Component Inventory & Node IDs

| Component | Figma Node ID | Implementation Path | Variants & States in Code |
| :--- | :--- | :--- | :--- |
| **Button** | `81:626` / `97:563` | `src/components/shared/Button/` | `primary`, `secondary`, `tertiary` × `xs`, `sm`, `md`, `lg` × `default`, `hover`, `active`, `focus`, `disabled` |
| **IconButton** | `595:2053` | `src/components/shared/IconButton/` | Circular action frame × `xs` (28px), `sm` (32px), `md` (36px), `lg` (40px) × `default`, `hover`, `active`, `focus`, `disabled` |
| **Input / TextField** | `438:5522` | `src/components/shared/Input/` | `sm` (32px), `md` (36px), `lg` (40px) × `default`, `hover`, `focus`, `invalid`, `disabled` |
| **Search Input** | `443:5544` / `438:4973` | `src/components/shared/SearchInput/` | Wraps `Input` with `SearchIcon` + interactive clear button (`hover`, `active`, `focus`, `disabled`) |
| **Checkbox** | `426:3084` | `src/components/shared/Checkbox/` | 16px control × `default`, `hover`, `active`, `checked`, `focus`, `invalid`, `disabled` |
| **Radio Button** | `424:3050` | `src/components/shared/Radio/` | 16px control × `default`, `hover`, `active`, `checked`, `focus`, `invalid`, `disabled` |
| **Dropdown / Menu** | `422:2570`, `422:2468` | `src/components/shared/Dropdown/` | `multiple` / single × `default`, `hover`, `active`, `open`, `selected`, `focus`, `invalid`, `disabled` |
| **Segmented Control** | `588:2445` | `src/components/shared/SegmentedControl/` | ARIA `radiogroup` × `sm`, `md`, `lg` × `default`, `hover`, `active`, `selected`, `focus`, `disabled` |
| **Tab** | `486:3426` | `src/components/shared/Tab/` | Underline tab with optional `count` × `default`, `hover`, `active`, `selected`, `focus`, `disabled` |
| **Badge** | `374:1871` | `src/components/shared/Badge/` | 10 semantic types (`trending`, `priority`, `spotlight`, `just-in`, `closed`, `success`, `warning`, `error`, `info`, `neutral`) + optional `dot` |
| **Side Navbar** | `361:24862` | `src/components/shared/SideNavbar/` | 80px rail, logo tile, top/footer nav groups, user avatar tile (`hover`, `active`, `focus`) |
| **Nav Item** | `360:23986` | `src/components/shared/NavItem/` | 80×80 rail tile × `default`, `hover`, `active`, `selected`, `focus`, `disabled` |
| **Page Header** | `444:5556` | `src/components/shared/PageHeader/` | Heading-2 title, integrated `SearchInput`, trailing action slot |
| **Icon System** | Lucide Core | `src/components/shared/Icon/` | `<Name>Icon` components + `<Icon>`, sizes `xs` (12), `sm` (16), `md` (20), `lg` (24) |
| **Sort & Filter Bar** | `438:5270` | `src/components/recruiter/SortFilterBar/` | Multi-select filter `Dropdown` row + right-aligned sort `Dropdown` |
| **Job Card** | `374:2067` | `src/components/recruiter/JobCard/` | Explore & Claimed states, company logo, `Badge`, kebab menu, commission footer |
| **Candidate Card** | Recruiter Track | `src/components/recruiter/CandidateCard/` | Initials avatar, social/resume icon actions, status pill, kebab menu, role/CTC meta |
| **Job Detail / Side Panel** | `489:3983` | `src/components/recruiter/JobDetail/` | Split-view detail drawer with `Tab` navigation, skill chips, sticky action footer |

---

## 4. Token Summary (`src/tokens/tokens.css`)

* **Typography:** `Inter`, weights `400` / `500` / `600`, sizes `10`, `12`, `14`, `16`, `20`, `24`, `32`, `40px`, tracking `--letter-spacing-tightest` (`-0.01em`), `--letter-spacing-tight` (`-0.005em`), `--letter-spacing-normal` (`0`), `--letter-spacing-loose` (`0.04em`). Composite classes: `.text-style-display`, `.text-style-heading-1`..`4` (`heading-4` is `16px/24px`), `.text-style-body-1`..`2`, `.text-style-label-1`..`4`, `.text-style-caption`, `.text-style-overline`.
* **Spacing (`--space-*`):** `0x` (0), `x-4` (1px), `x-2` (2px), `1x` (4px), `2x` (8px), `3x` (12px), `4x` (16px), `5x` (20px), `6x` (24px), `7x` (28px), `8x` (32px), `9x` (36px), `10x` (40px), `12x` (48px), `16x` (64px), `20x` (80px).
* **Borders & Radii:** `--border-width-thin` (1px), `--border-width-thick` (2px); `--radius-none` (0), `--radius-xs`/`--radius-2xs` (2px), `--radius-sm`/`--radius-4` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl` (16px), `--radius-2xl` (24px), `--radius-pill` (100px), `--radius-max`/`--radius-full` (999px). Standardized 1:1 across code and Figma.
* **Elevation & Motion:** `--elevation-xs`, `--elevation-sm`, `--elevation-md`, `--elevation-lg`, `--elevation-drawer`; `--duration-fast` (120ms), `--duration-normal` (180ms), `--duration-slow` (240ms), `--easing-standard`, `--easing-out`.

---

## 5. Component Token Attachment Contract

| Component | Surfaces & Backgrounds | Text & Typography | Borders, Shadows & Focus | Sizing & Spatial Tokens |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | `--button-{variant}-background[-hover\|-active\|-disabled]` | `--button-{variant}-text[-disabled]` | `--button-secondary-border[-hover\|-disabled]`, Focus: `--button-{variant}-focus-ring` | Heights: `--button-height-{xs\|sm\|md\|lg}` (28–40px), Radius: `--button-corner-radius-*` |
| **IconButton** | Default: `--icon-button-background`, Hover: `--icon-button-background-hover` (`neutral/50`), Active: `--icon-button-background-active` | Default: `--icon-button-color` (`text/secondary`), Hover/Active: `--icon-button-color-hover` (`text/primary`) | Border: `transparent` (default borderless) / `--semantics-border-default` (`bordered`), Focus: `--icon-button-focus-ring` | Dimensions: `--icon-button-size-{xs\|sm\|md\|lg}` (28–40px), Radius: `--icon-button-radius` (`full`) |
| **Input** | `--semantics-control-bg[-disabled]` | `--semantics-text-{primary\|placeholder\|disabled\|danger}` | `--semantics-control-border[-hover\|-focus\|-error]`, `--semantics-focus-ring[-danger]` | Heights: `--control-height-{sm\|md\|lg}` (32/36/40px), Padding: `--space-3x`, Radius: `--radius-md` |
| **SearchInput** | Inherits `Input` + Clear hover: `--semantics-surface-tertiary` | Icon/Clear: `--semantics-text-{placeholder\|primary\|disabled}` | Focus: `--semantics-border-focus` | Clear button: `--size-icon-md` (20px), Radius: `--radius-pill` |
| **Checkbox** | `--semantics-control-bg[-hover\|-disabled]`, Checked: `--semantics-control-indicator-checked` | Check: `--semantics-text-inverse`, Label: `--semantics-text-{secondary\|disabled}` | `--semantics-control-border[-hover\|-error]`, Focus: `--semantics-border-focus` | Box: `--control-size-sm` (16px), Radius: `--radius-4` (4px) |
| **Radio** | `--semantics-control-bg[-hover\|-disabled]`, Dot: `--semantics-control-indicator-checked` | Label: `--semantics-text-{secondary\|disabled}` | `--semantics-control-border[-hover\|-error]`, Focus: `--semantics-border-focus` | Outer: `--control-size-sm` (16px), Dot: `--space-2x` (8px), Radius: `--radius-pill` |
| **Dropdown** | Trigger: `--button-secondary-background[-hover\|-active\|-disabled]`, Selected: `--semantics-surface-brand-subtle`, Menu: `--semantics-surface-primary` | Trigger: `--semantics-text-secondary`, Disabled: `--button-secondary-text-disabled`, Counter: `--semantics-interactive-primary` | Trigger: `--button-secondary-border[-hover\|-disabled]`, Menu: `--semantics-border-strong` + `--elevation-md` | Trigger: `--control-height-sm` (32px), Menu item radius: `--radius-4` |
| **SegmentedControl** | Track: `--segmented-track-bg`, Hover: `--segmented-item-bg-hover`, Active: `--segmented-item-bg-active` | `--segmented-item-text[-hover\|-active\|-disabled]`, Count: `--semantics-text-{tertiary\|link}` | Track: `--segmented-track-border`, Active pill: `--segmented-item-shadow-active` (`--elevation-xs`) | Heights: `--control-height-{sm\|md\|lg}` (32/36/40px), Track radius: `--radius-md`, Item: `--radius-4` |
| **Tab** | Transparent, Pressed: `--semantics-surface-hover-subtle`, Count: `--semantics-surface-{secondary\|brand-subtle\|disabled}` | Idle: `--semantics-text-tertiary`, Hover: `--semantics-text-primary`, Active: `--semantics-text-link`, Disabled: `--semantics-text-disabled` | Hover bar: `--semantics-border-strong`, Active bar: `--semantics-border-interactive` | Padding: `var(--space-3x) var(--space-4x)`, Bar height: `--border-width-thick` (2px) |
| **Badge** | `--semantics-badge-{type}-bg` | `--semantics-badge-{type}-text` | `--semantics-badge-{type}-border` | Padding: `var(--space-x-2) var(--space-2x)`, Dot: `--space-x-2`, Radius: `--radius-pill` |
| **SideNavbar & NavItem** | Rail: `--semantics-background-primary`, Tile hover/active: `--semantics-interactive-subtle[-hover]` | Idle: `--semantics-text-tertiary`, Active: `--semantics-text-link`, Disabled: `--semantics-text-disabled` | Rail divider: `--semantics-border-default`, Focus: `--semantics-border-focus` | Rail & tile: `--space-20x` (80px), Avatar: `--space-8x` (32px) |
