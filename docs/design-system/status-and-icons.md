# Status Indicators, Icons & New Component Contract

---

## Badge (`@/components/shared/Badge`)

Use for non-interactive status, stage, and role-priority indicators. If the user can click it to filter or toggle, use `Button`, `Dropdown`, or `SegmentedControl` — never put an `onClick` on `Badge`.

Types (`BadgeType`):
- Job marketplace tags: `trending` (red), `priority` (amber), `spotlight` (brand violet), `just-in` (blue), `closed` (slate).
- Semantic status tags: `success` (green), `warning` (amber), `error` (red), `info` (blue), `neutral` (slate).
- Nothing else exists — an unlisted `type` is a bug, not an option.

```text
Which semantic Badge type?
 ├── Completed / Earned / Paid / Joined ──────────────► type="success"
 ├── Active / Shortlisted / Potential / Offer ────────► type="spotlight"
 ├── In-progress / Processing / Interview / Review ───► type="info"
 ├── Awaiting action / Pending / On hold ─────────────► type="warning"
 ├── Failed / Rejected / Reversed ────────────────────► type="error"
 └── Inactive / Ineligible / Closed / Not payable ────► type="neutral"
```

- Pass `dot` (`dot={true}`) only when distinguishing primary eligibility state (e.g., `Earned` / `Potential` / `Ineligible` in `RecruiterEarnings`) from adjacent secondary badges. Never combine two dimensions into one badge (`"Earned — Pending"` is banned; render two separate `<Badge>` pills).

```tsx
// Correct — separate semantic badges for Earning vs Payment dimensions
<Badge type="success" dot>Earned</Badge>
<Badge type="warning">Pending</Badge>

// Incorrect — invented variant="green" and compound status label
<Badge type={"green" as any}>Earned — Pending</Badge>
```

---

## Tag (`@/components/shared/Tag`)

Tags display non-interactive informational metadata, taxonomies (e.g. skills), and pipeline statuses across cards.

- **Appearance:** Borderless pill with soft tinted surface fill and high-contrast text:
  - `border: none` (borderless by design)
  - `border-radius: var(--tag-radius)` (`var(--radius-pill)`)
  - Typography: `.text-style-label-3` (`12px / 12px`, Medium) for `size="md"` (default); `.text-style-label-4` (`10px`) for `size="sm"`.
- **Strict Rule — No Hover State on Body:** Tags are static informational metadata, not buttons. Never add `:hover`, `:active`, or cursor changes to the tag body; hover styling falsely suggests button interactivity.

### Semantic Status Variants

All status variants are **borderless** and consume the design system's subtle surface tints paired with high-contrast text tokens:

| Variant | Surface Token | Text Token | Candidate Card Status | Job Card Equivalent |
| :--- | :--- | :--- | :--- | :--- |
| `neutral` | `--semantics-surface-secondary` | `--semantics-text-secondary` | `Submitted` | `Closed` |
| `brand` | `--semantics-surface-brand-subtle` | `--semantics-text-brand` | `SuperHire review` | `Spotlight` |
| `info` | `--semantics-surface-info-subtle` | `--semantics-text-info` | `Employer review`, `Shortlisted`, `Interview` | `Just In` |
| `warning` | `--semantics-surface-warning-subtle` | `--semantics-text-warning` | `On hold` | `Priority`, `Trending` |
| `success` | `--semantics-surface-success-subtle` | `--semantics-text-success` | `Offer`, `Joined` | Completed / Active |
| `danger` | `--semantics-surface-danger-subtle` | `--semantics-text-danger` | `Rejected` | Expired |

### Features & Props

- `variant`: `"neutral" | "brand" | "info" | "warning" | "success" | "danger"` (default `"neutral"`)
- `size`: `"sm" | "md"` (default `"md"`)
- `dot`: Optional status dot (`boolean`) rendered in `currentColor`
- `icon`: Optional leading icon component
- `onRemove`: Optional dismiss handler for editable forms (renders an embedded accessible `(×)` button)

```tsx
import { Tag } from "@/components/shared/Tag";

// Standard Skill Tag (neutral)
<Tag>React</Tag>

// Candidate Card Pipeline Statuses
<Tag variant="neutral">Submitted</Tag>
<Tag variant="info">Review</Tag>
<Tag variant="brand">Shortlisted</Tag>
<Tag variant="warning">Interview</Tag>
<Tag variant="success">Offered</Tag>
<Tag variant="success">Joined</Tag>
<Tag variant="danger">Rejected</Tag>

// With leading status dot
<Tag variant="success" dot>Joined</Tag>

// With leading icon
<Tag icon={CodeIcon}>GraphQL</Tag>

// Editable / Removable in form builder
<Tag onRemove={() => removeSkill("Python")}>Python</Tag>
```

---

## Icon (`@/components/shared/Icon`)

All icons come from `@/components/shared/Icon` (wrapping Lucide with Bolt size tokens). Never import `lucide-react` directly in feature components, and never paste inline `<svg>` paths in product screens.

Sizes (`IconSize`): `xs` (`12px`), `sm` (`16px`), `md` (`20px`, default), `lg` (`24px`).

- `xs` (`12px`) — inside `xs`/`sm` buttons, `Checkbox` checkmarks, inline external-link indicators.
- `sm` (`16px`) — `md` buttons, `Dropdown` chevrons, card metadata icons, `SearchInput` magnifier.
- `md` (`20px`) — `SideNavbar` items, drawer close (`XIcon`) buttons, `lg` buttons.
- `lg` (`24px`) — empty-state illustrations or hero callouts.
- Decorative icons default to `aria-hidden="true"`. Pass `label="..."` only when the icon stands alone without accessible button/link text.

```tsx
// Correct — named export from @/components/shared/Icon with token size
import { ArrowRightIcon } from "@/components/shared/Icon";
<ArrowRightIcon size="sm" />

// Incorrect — direct lucide-react import with arbitrary 15px size
import { ArrowRight } from "lucide-react";
<ArrowRight size={15} color="#64748b" />
```

---

## New Component Authoring Contract

Whenever a new shared component is created under `src/components/shared/<ComponentName>/`:

1. **Folder structure:** `<Name>.tsx`, `<Name>.types.ts`, `<Name>.module.css`, `index.ts`, re-exported from `src/components/shared/index.ts`.
2. **DOM & API hygiene:**
   - Wrap with `forwardRef` and spread remaining HTML attributes (`{...rest}`).
   - Default `<button>` `type` to `"button"` (never `"submit"`).
   - Express variants and sizes as closed TypeScript string unions (`variant?: ...`, `size?: "sm" | "md" | "lg"`), plus `className?: string`.
3. **Mandatory Micro-State Token Checklist:** Every interactive element MUST style all applicable states using tokens from `src/tokens/tokens.css`:
   - `default` — resting surface, text, and border tokens.
   - `:hover:not(:disabled)` — hover surface/border/text tokens (guard touch devices with `@media (hover: hover) and (pointer: fine)` where sticky hover is undesirable).
   - `:active:not(:disabled)` — pressed feedback token (`--button-*-background-active`, `--semantics-surface-tertiary`, or subtle scale).
   - `:focus-visible` — `outline: var(--border-width-thick) solid var(--semantics-border-focus)` (or `--semantics-focus-ring` on text inputs). Never `outline: none` without a replacement focus indicator.
   - `:disabled` / `[aria-disabled="true"]` — `--semantics-surface-disabled`, `--semantics-text-disabled`, `--semantics-border-disabled`, `cursor: not-allowed`.
   - `[aria-invalid="true"]` / `[data-invalid]` (form controls) — `--semantics-control-border-error` and `--semantics-focus-ring-danger`.
4. **Documentation & Figma Sync:**
   - Add the component using the 4-part template to the matching file in `docs/design-system/`.
   - Add its Figma node ID and token attachment row to [`docs/DESIGN_SYSTEM_FOUNDATIONS.md`](../DESIGN_SYSTEM_FOUNDATIONS.md).
   - Create the matching `COMPONENT_SET` in Figma (`R4SLa0NOU3UHMfnEFJJmxp`) with every state variant bound to Figma variables (zero raw fills/strokes, explicit variable scopes, and `WEB` `codeSyntax`).
