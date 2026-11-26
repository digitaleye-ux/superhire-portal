# Typography, Spacing, Radii & Motion

Source of truth: [`src/tokens/tokens.css`](../../src/tokens/tokens.css). Font family is always `var(--font-family-sans)` (`Inter`).

---

## 1. Typescale Rules

Only **8 font sizes** and **3 font weights** exist in Bolt. Never use `11px`, `13px`, `15px`, `18px`, `28px`, or `font-weight: 700`.

- Weights: `--font-weight-regular` (`400`), `--font-weight-medium` (`500`), `--font-weight-semibold` (`600`).
- Minimum readable size: `12px` (`--font-size-12`). `--font-size-10` (`10px`) is restricted strictly to compact count pills inside `SegmentedControl` or micro-badges.
- Every font size MUST pair with its matching line-height token (`--font-size-14` $\rightarrow$ `--line-height-14`).

| Style Class | Size / Line-Height | Weight | Tracking Token | When to Use |
| :--- | :--- | :--- | :--- | :--- |
| `.text-style-display` | `40px` / `48px` | Semibold (`600`) | `--letter-spacing-display` (`-0.01em`) | Marketing/hero numerals only |
| `.text-style-heading-1` | `32px` / `40px` | Semibold (`600`) | `--letter-spacing-heading` (`-0.005em`) | Lifetime financial hero figures |
| `.text-style-heading-2` | `24px` / `32px` | Semibold (`600`) | `--letter-spacing-heading` (`-0.005em`) | Page titles (`PageHeader`), KPI card values |
| `.text-style-heading-3` | `20px` / `28px` | Semibold (`600`) | `--letter-spacing-heading` (`-0.005em`) | Section titles, drawer titles |
| `.text-style-heading-4` | `16px` / `24px` | Semibold (`600`) | `--letter-spacing-heading` (`-0.005em`) | Sub-section headings inside drawers/cards |
| `.text-style-body-1` | `16px` / `24px` | Regular (`400`) | `--letter-spacing-none` (`0`) | Large input text (`Input` `lg`) |
| `.text-style-body-2` | `14px` / `20px` | Regular (`400`) | `--letter-spacing-none` (`0`) | Default body copy, descriptions, table cells |
| `.text-style-label-1` | `16px` / `24px` | Medium (`500`) | `--letter-spacing-none` (`0`) | Card primary titles (`JobCard`, `CandidateCard`), `Button` `lg` |
| `.text-style-label-2` | `14px` / `20px` | Medium (`500`) | `--letter-spacing-none` (`0`) | Field labels, `Tab` labels, `Button` `md`, table primary names |
| `.text-style-label-3` | `12px` / `16px` | Medium (`500`) | `--letter-spacing-none` (`0`) | `Badge` text, `Button` `xs`/`sm`, `NavItem` labels, chips |
| `.text-style-label-4` | `10px` / `12px` | Medium (`500`) | `--letter-spacing-none` (`0`) | `SegmentedControl` compact count badges only |
| `.text-style-caption` | `12px` / `16px` | Regular (`400`) | `--letter-spacing-none` (`0`) | Input hints, validation messages, timestamps |
| `.text-style-overline` | `12px` / `16px` | Medium (`500`) | `--letter-spacing-overline` (`0.04em`) | Uppercase KPI card & metric labels (`text-transform: uppercase`) |

*Why `%` tracking is banned in CSS:* CSS `letter-spacing` ignores percentage values (`-0.5%` is invalid CSS and dropped by browsers). Always use `--letter-spacing-heading` (`-0.005em`).

---

## 2. Spatial Scale (`--space-*`)

Use `--space-*` tokens in components (never `--spacing-*` primitives or raw `px` for padding, margin, or gap):

| Token | Value | Typical Usage |
| :--- | :--- | :--- |
| `--space-0x` | `0px` | Reset |
| `--space-x-4` | `1px` | Focus-ring offset |
| `--space-x-2` | `2px` | Badge vertical padding, segmented track padding |
| `--space-1x` | `4px` | Icon-to-text micro gap, menu item padding |
| `--space-2x` | `8px` | Label-to-input gap, button icon gap, toolbar control gap |
| `--space-3x` | `12px` | Card compact padding, control horizontal padding |
| `--space-4x` | `16px` | Standard card grid gap, panel footer padding |
| `--space-5x` | `20px` | Table horizontal cell padding |
| `--space-6x` | `24px` | Section internal stack gap, drawer header padding |
| `--space-7x` | `28px` | Extra-small control height (`--button-height-xs`) |
| `--space-8x` | `32px` | Page gutter padding (`PageHeader`, workspace scroll), `sm` control height |
| `--space-9x` | `36px` | Medium control height (`--button-height-md`, `--control-height-md`) |
| `--space-10x` | `40px` | Large control height (`--control-height-lg`), section stack gap |
| `--space-12x` | `48px` | Major dashboard section separation |
| `--space-16x` | `64px` | Page bottom breathing room |
| `--space-20x` | `80px` | `SideNavbar` rail & `NavItem` tile dimension |

---

## 3. Border Radius & Motion

- **Standardized Radii (`xs=2px, sm=4px, md=8px, lg=12px, xl=16px, 2xl=24px, full=999px`):**
  - `--radius-none` (`0px`) — square resets.
  - `--radius-xs` / `--radius-2xs` (`2px`) — micro badges, precision accents.
  - `--radius-sm` / `--radius-4` (`4px`) — checkboxes, menu items, icon buttons, segmented inner items, company logo favicons.
  - `--radius-md` (`8px`) — buttons, inputs, dropdown triggers/menus, `JobCard` / `CandidateCard`, `SegmentedControl` track.
  - `--radius-lg` (`12px`) — large dashboard/earnings surface containers (`.surfaceCard`, `.kpiCard`, `.pipelineCard`, `.tableRegion`).
  - `--radius-xl` (`16px`) — modal sheets and floating sheets.
  - `--radius-2xl` (`24px`) — large hero panels.
  - `--radius-pill` (`100px`) / `--radius-max` / `--radius-full` (`999px`) — `Badge`, `Radio`, avatars, skill chips.
- **Motion:**
  - `--duration-fast` (`120ms`) + `--easing-standard` — hover, focus, active color/border transitions.
  - `--duration-normal` (`180ms`) / `--duration-slow` (`240ms`) + `--easing-out` — drawer/popover entrances. Always respect `@media (prefers-reduced-motion: reduce)`.
