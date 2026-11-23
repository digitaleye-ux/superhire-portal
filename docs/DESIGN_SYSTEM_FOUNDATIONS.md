# Bolt Design System — Foundations & Component Manifest

This document records all foundations, tokens, Figma node IDs, and component specifications extracted from the official **Bolt | Design System** file (`R4SLa0NOU3UHMfnEFJJmxp`). Use this manifest when spinning up the standalone design system package or Storybook in the future.

---

## 1. Figma Source File

* **File Name:** `Bolt | Design System`
* **File Key:** `R4SLa0NOU3UHMfnEFJJmxp`
* **Team:** Ashik Mathew Tharakan's team
* **Base URL:** `https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System`

---

## 2. Foundation Nodes & Source Links

| Foundation | Figma Node ID | Direct URL | Description |
| :--- | :--- | :--- | :--- |
| **Typography (Typescale)** | `32:2825` | [View Node 32:2825](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=32-2825) | Typescale table: 12 composite text styles, size scales, line heights, letter spacings |
| **Color Palette** | `5:526` | [View Node 5:526](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=5-526) | Full primitive color swatches (Primary, Neutral, Success, Warning, Error, Info 50–900) |
| **Spatial Tokens** | `57:267` | [View Node 57:267](https://www.figma.com/design/R4SLa0NOU3UHMfnEFJJmxp/Bolt-%7C-Design-System?node-id=57-267) | Spacing scale table: `spacing-0x` through `spacing-20x` (0px to 80px) |

---

## 3. Component Inventory & Node IDs

| Component | Figma Node ID | Implementation Path | Notes |
| :--- | :--- | :--- | :--- |
| **Input / TextField** | `438:5522` | `src/components/shared/Input/` | 40px height, 8px radius, 14px label, 16px text, overlay prefix/suffix |
| **Search Input** | `443:5544` / `438:4962` | `src/components/shared/SearchInput/` | Integrated search icon, 40px height, clear trigger |
| **Checkbox** | `426:3084` | `src/components/shared/Checkbox/` | 16px control, 4px radius, primary fill on active, accessible hidden input |
| **Radio Button** | `424:3050` | `src/components/shared/Radio/` | 16px control, inner filled dot when checked |
| **Dropdown / Menu** | `422:2570`, `422:2468` | `src/components/shared/Dropdown/` | Node 422:2570 (trigger & menu container), 422:2468 (menu item) |
| **Tab** | `486:3426` | `src/components/shared/Tab/` | States: Default, Hover (subtle border), Active (primary underline) |
| **Badge** | `374:1871` | `src/components/shared/Badge/` | Status pill, 8px/2px padding, 12px/16 medium text |
| **Side Navbar** | `361:24862` | `src/components/shared/SideNavbar/` | Vertical navigation rail, active states, avatar footer |
| **Nav Item** | `360:23986` | `src/components/shared/NavItem/` | Icon + label, default, hover, active link states |
| **Page Header** | `444:5556` | `src/components/shared/PageHeader/` | Title, subtitle, action buttons, search integration |
| **Sort & Filter Bar** | `438:5270` | `src/components/recruiter/SortFilterBar/` | Multi-select filter pills, sort dropdown |
| **Job Card** | `374:2067` | `src/components/recruiter/JobCard/` | Company logo, title, details, package, commission tag |
| **Icon / Icons System** | Lucide Core | `src/components/shared/Icon/` | Universal Lucide icon system, `<Name>Icon` naming convention, token sizes (`xs`, `sm`, `md`, `lg`) |

---

## 4. Token Definitions (Synced in `src/tokens/tokens.css`)

### A. Typography Primitives
* **Family:** `"Inter", system-ui, sans-serif`
* **Weights:** `Regular (400)`, `Medium (500)`, `Semibold (600)`
* **Size & Line-height Scale:**
  * `40px` / `48px`
  * `32px` / `40px`
  * `24px` / `32px`
  * `20px` / `28px`
  * `16px` / `24px`
  * `14px` / `20px`
  * `12px` / `16px`
  * `10px` / `12px`
* **Composite Text Styles:**
  * `.text-style-display` (40px/48px Semibold, -1% letter spacing)
  * `.text-style-heading-1` (32px/40px Semibold, -0.5%)
  * `.text-style-heading-2` (24px/32px Semibold, -0.5%)
  * `.text-style-heading-3` (20px/28px Semibold, -0.5%)
  * `.text-style-heading-4` (18px/24px Semibold, -0.5%)
  * `.text-style-body-1` (16px/24px Regular, 0)
  * `.text-style-body-2` (14px/20px Regular, 0)
  * `.text-style-caption` (12px/16px Regular, 0)
  * `.text-style-label-1` (16px/24px Medium, 0)
  * `.text-style-label-2` (14px/20px Medium, 0)
  * `.text-style-label-3` (12px/16px Medium, 0)
  * `.text-style-label-4` (10px/12px Medium, 0)
  * `.text-style-overline` (12px/16px Medium, +4% uppercase)

### B. Color Primitives (50–900)
* **Primary:** `#FAFAFF`, `#EBE9FE`, `#D9D6FE`, `#BDB4FE`, `#9B8AFB`, `#7A5AF8`, `#6938EF` *(Key)*, `#5925DC`, `#4A1FB8`, `#3E1C96`
* **Neutral:** `#F8FAFC`, `#F1F5F9`, `#E2E8F0`, `#CBD5E1`, `#94A3B8`, `#64748B`, `#475569`, `#334155`, `#1E293B`, `#0F172A`
* **Success:** `#ECFDF5` to `#064E3B` (Key: `#10B981` / `#059669`)
* **Warning:** `#FFFBEB` to `#78350F` (Key: `#F59E0B` / `#D97706`)
* **Error:** `#FEF2F2` to `#7F1D1D` (Key: `#EF4444` / `#DC2626`)
* **Info:** `#EFF6FF` to `#1E3A8A` (Key: `#3B82F6` / `#2563EB`)

### C. Spatial Scale (Figma `57:267`)
* `spacing-0x`: `0px`
* `spacing-1x`: `4px`
* `spacing-2x`: `8px`
* `spacing-3x`: `12px`
* `spacing-4x`: `16px`
* `spacing-5x`: `20px`
* `spacing-6x`: `24px`
* `spacing-8x`: `32px`
* `spacing-10x`: `40px`
* `spacing-12x`: `48px`
* `spacing-16x`: `64px`
* `spacing-20x`: `80px`

### D. Semantic Layer Nomenclature
Standard: `--semantics-{domain}-{role}[-{state}]`
* **Surfaces:** `--semantics-surface-{primary | secondary | tertiary | page | brand | brand-subtle | ...}`
* **Text:** `--semantics-text-{primary | secondary | tertiary | placeholder | link | on-brand | ...}`
* **Borders:** `--semantics-border-{subtle | default | strong | interactive | focus | danger | ...}`
* **Controls:** `--semantics-control-{bg | border | border-hover | border-focus | border-error}`
* **Badges:** `--semantics-badge-{trending | urgent | spotlight | info | neutral | success}-{bg | text | border}`
* **Spacing:** `--semantics-spacing-{gap-inline | gap-stack | padding-control | padding-card | padding-panel}-{size}`

### E. Icon System & Nomenclature
Standardized on Lucide with consistent design system naming conventions and tokens:
* **Size Tokens:**
  * `--size-icon-xs`: `12px` (meta labels, small badges, checkbox check)
  * `--size-icon-sm`: `16px` (dropdown chevrons, kebab actions, card commission/cta, button icons)
  * `--size-icon-md`: `20px` (sidebar nav items, panel close headers)
  * `--size-icon-lg`: `24px` (hero actions, section headers)
* **Naming Conventions:**
  * Component exports: `<Name>Icon` (e.g. `BriefcaseBusinessIcon`, `IndianRupeeIcon`, `MapPinIcon`, `HandCoinsIcon`, `ArrowRightIcon`, `CheckIcon`, `XIcon`, `ChevronDownIcon`, `ChevronUpIcon`, `SearchIcon`, `MoreVerticalIcon`, `DownloadIcon`, `BookmarkXIcon`, `FileTextIcon`, `LinkedinIcon`, `GithubIcon`, `LinkIcon`)
  * Ergonomic aliases: `BriefcaseIcon`, `RupeeIcon`, `LocationIcon`, `CommissionIcon`, `ResumeIcon`, `CloseIcon`, `UnclaimIcon`, `CircleCheckIcon`, `UsersIcon`, `HelpCircleIcon`
  * Universal component: `<Icon name="briefcase" size="sm" />` or `<Icon icon={BriefcaseBusiness} size={16} />`
  * Namespace object: `Icons.Briefcase`, `Icons.IndianRupee`, `Icons.Search`, etc.

---

## 5. Component Token Attachment Contract

Every developed component is linked directly to semantic and spatial tokens instead of hardcoded hex values or raw primitives:

| Component | Surfaces & Backgrounds | Text & Typography | Borders & Focus | Sizing & Spatial Tokens |
| :--- | :--- | :--- | :--- | :--- |
| **Input / TextField** | `--semantics-control-bg` | `--semantics-text-primary`, `--semantics-text-placeholder`, `--semantics-text-danger` | Border: `--semantics-control-border`<br>Hover: `--semantics-control-border-hover`<br>Focus: `--semantics-control-border-focus` + `--semantics-focus-ring`<br>Error: `--semantics-control-border-error` + `--semantics-focus-ring-danger` | Height: `--control-height-lg` (40px)<br>Padding: `0 var(--space-3x)`<br>Radius: `--radius-md` (8px) |
| **Checkbox** | `--semantics-control-bg`, Checked: `--semantics-control-indicator-checked` | Check icon: `--semantics-text-inverse`, Label: `--semantics-text-secondary` | `--semantics-control-border`, Checked: `--semantics-control-indicator-checked`, Focus: `--semantics-border-focus` | Size: `--control-size-sm` (16px × 16px)<br>Radius: `--radius-4` (4px) |
| **Radio Button** | `--semantics-control-bg`, Checked dot: `--semantics-control-indicator-checked` | Label: `--semantics-text-secondary` | `--semantics-control-border`, Checked: `--semantics-control-indicator-checked`, Focus: `--semantics-border-focus` | Outer ring: `--control-size-sm` (16px × 16px)<br>Inner dot: `--space-2x` (8px × 8px) |
| **Dropdown / Menu** | Trigger: `--button-secondary-background`, Menu: `--semantics-surface-primary`, Selected: `--semantics-surface-brand-subtle` | Trigger: `--semantics-text-secondary`, Counter: `--semantics-interactive-primary` | Trigger: `--button-secondary-border`, Menu: `--semantics-border-strong`, Focus: `--semantics-border-focus` | Height: `--control-height-sm` (32px)<br>Counter: `--size-icon-sm`<br>Clear: `--size-icon-sm` |
| **Search Input** | `--semantics-control-bg` | `--semantics-text-primary`, `--semantics-text-placeholder` | Border: `--semantics-control-border`, Hover: `--semantics-control-border-hover`, Focus: `--semantics-control-border-focus` | Height: `--control-height-sm` (32px)<br>Padding: `0 var(--space-3x)`<br>Radius: `--radius-md` (8px) |
| **Tab** | Transparent | Idle: `--semantics-text-tertiary`, Active: `--semantics-text-link` | Hover underline: `--semantics-border-strong`, Active underline: `--semantics-border-interactive` | Padding: `var(--space-2x) var(--space-4x)`<br>Underline: `2px` pill |
| **Badge** | Variant-based: `--semantics-badge-{type}-bg` | Variant-based: `--semantics-badge-{type}-text` | Variant-based: `--semantics-badge-{type}-border` | Padding: `var(--space-x-2) var(--space-2x)`<br>Radius: `--radius-pill` |
| **Nav Item** | Hover: `--semantics-interactive-subtle`, Active: `--semantics-interactive-subtle-hover` | Idle: `--semantics-text-tertiary`, Active: `--semantics-text-link` | Focus: `--semantics-border-focus` | Tile size: `var(--space-20x)` (80px × 80px)<br>Padding: `var(--space-4x)` |
| **Side Navbar** | `--semantics-background-primary` | Link & tertiary text tokens | Separator: `--semantics-border-default` | Width: `var(--space-20x)` (80px)<br>Avatar: `var(--space-8x)` (32px × 32px) |
| **Job Card** | `--semantics-background-primary` | Title: `--semantics-text-primary`, Meta: `--semantics-text-tertiary`, Link: `--semantics-text-link` | Default: `--semantics-border-strong`, Hover: `--semantics-border-focus`, Divider: `--semantics-border-default` | Company logo: `var(--size-icon-md)` (20px × 20px)<br>Footer icon: `var(--size-icon-sm)` (16px) |
| **Job Detail Panel** | `--semantics-background-primary`, Chips: `--semantics-surface-brand-subtle` / `--semantics-surface-info-subtle` | Title: `--semantics-text-primary`, Body: `--semantics-text-secondary`, Chips: `--semantics-text-brand` / `--semantics-text-info` | Dividers: `--semantics-border-default`, Border: `--semantics-border-strong` | Logo: `var(--size-icon-lg)` (24px × 24px)<br>Bullets padding: `var(--space-5x)`<br>Action button: `--button-height-md` (36px) |
| **Submit Candidate Modal** | Form panels, Drop zones: `--semantics-surface-primary`, Hero drop: `--semantics-surface-brand-subtle`, Segmented control: `--semantics-surface-secondary` | Heading: `--semantics-text-primary`, Hints/counts: `--semantics-text-tertiary`, Errors: `--semantics-text-danger`, Link: `--semantics-text-link` | Form inputs: `--semantics-control-border`, Drop zone: `--semantics-border-strong` / `--semantics-border-interactive` | Inputs: `--control-height-lg` (40px)<br>Checkboxes: `--control-size-sm` (16px)<br>Drop icon: `--control-height-md` (36px) |

---

## 6. Future Extraction Checklist

When creating the standalone design system package:
1. [x] Tokens synced to Figma typescale (`32:2825`), palette (`5:526`), and spacing (`57:267`).
2. [x] Zero hardcoded hexes or raw primitives in component modules.
3. [ ] Move `src/tokens/tokens.css` into the design system core tokens package.
4. [ ] Copy all agnostic atom components from `src/components/shared/` (`Button`, `Input`, `Checkbox`, `Radio`, `Dropdown`, `Tab`, `Badge`, `SearchInput`, `Icon`).
5. [ ] Initialize Storybook or living documentation using the node links in Section 2 & 3.
6. [ ] Link back to this portal via package dependency (`@bolt/ui` or `@superhire/design-system`).
