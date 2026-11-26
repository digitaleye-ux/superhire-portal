# Colors, Surfaces & Elevation

Source of truth: [`src/tokens/tokens.css`](../../src/tokens/tokens.css). Never reference `--primitives-*` or raw `#hex` / `rgba()` in component CSS.

---

## 1. Surface Selection Flowchart

```text
What surface am I coloring?
 ├── App viewport / root canvas ──────────────────► --semantics-surface-page
 ├── Primary card, table, drawer, or modal ───────► --semantics-surface-primary
 ├── Subtle inset band, toolbar track, hover row ─► --semantics-surface-secondary
 ├── Pressed row, count chip, or tertiary fill ───► --semantics-surface-tertiary
 ├── Disabled input, button, or card ─────────────► --semantics-surface-disabled
 ├── Modal / drawer backdrop scrim ───────────────► --semantics-surface-overlay
 ├── Hover tint on a secondary track ─────────────► --semantics-surface-hover-subtle
 └── Tinted callout or selected state
      ├── Brand / selected row or card ───────────► --semantics-surface-brand-subtle
      ├── Positive / verified banner ─────────────► --semantics-surface-success-subtle
      ├── Caution / pending callout ──────────────► --semantics-surface-warning-subtle
      ├── Error / destructive hover ──────────────► --semantics-surface-danger-subtle
      └── Informational notice ───────────────────► --semantics-surface-info-subtle
```

---

## 2. Text Color Flowchart

```text
What text am I coloring?
 ├── Headings, KPI values, candidate/role names ──► --semantics-text-primary
 ├── Body copy, table cells, unselected controls ─► --semantics-text-secondary
 ├── Captions, overlines, timestamps, hints ──────► --semantics-text-tertiary
 ├── Input placeholders (never body copy) ────────► --semantics-text-placeholder
 ├── Disabled labels or controls ─────────────────► --semantics-text-disabled
 ├── Clickable links, active tabs, inline actions ► --semantics-text-link (hover: --semantics-text-link-hover)
 ├── Text on --semantics-interactive-primary ─────► --semantics-text-on-brand
 └── Semantic status copy
      ├── Earned / positive ──────────────────────► --semantics-text-success
      ├── Warning / pending ──────────────────────► --semantics-text-warning
      ├── Validation error / destructive action ──► --semantics-text-danger
      └── Informational ──────────────────────────► --semantics-text-info
```

*Why `--semantics-text-placeholder` is banned for captions:* `#94A3B8` fails WCAG AA 4.5:1 contrast for body/caption reading; `--semantics-text-tertiary` passes.

---

## 3. Borders & Focus Rings

Always pair border colors with `--border-width-thin` (`1px`) or `--border-width-thick` (`2px`).

### Three-Tier Neutral Stroke, Border & Divider System
| Level | Primitive | Semantic Tokens | Primary Use Cases |
| :--- | :--- | :--- | :--- |
| **1. Subtle** | `neutral-100` (`#F1F5F9`) | `--semantics-border-subtle`<br>`--semantics-divider-subtle`<br>`--semantics-stroke-subtle` | Table row hairlines, soft nested separators on white surfaces |
| **2. Default** | `neutral-200` (`#E2E8F0`) | `--semantics-border-default`<br>`--semantics-divider-default`<br>`--semantics-stroke-default` | Standard cards (`JobCard`, `CandidateCard`), section dividers, layout splitters |
| **3. Strong** | `neutral-300` (`#CBD5E1`) | `--semantics-border-strong`<br>`--semantics-divider-strong`<br>`--semantics-stroke-strong` | High-contrast structural boundaries, form control outlines, floating dropdown menus |

### Interactive & Status Strokes
- `--semantics-border-hover` — hovered neutral chips and non-input pills.
- `--semantics-border-interactive` — selected cards, active tab underlines, active filter triggers.
- `--semantics-border-focus` — keyboard `:focus-visible` outlines (`outline: var(--border-width-thick) solid var(--semantics-border-focus)`).
- `--semantics-border-disabled` — disabled controls and cards.
- Status borders: `--semantics-border-success`, `--semantics-border-warning`, `--semantics-border-danger`, `--semantics-border-info`.

---

## 4. Elevation & Shadows

Never invent custom `box-shadow` strings. Pick from the 5 system elevations:

| Token | Usage |
| :--- | :--- |
| `--elevation-xs` | Active `SegmentedControl` pills and raised micro-controls |
| `--elevation-sm` | Hovered KPI / interactive summary cards |
| `--elevation-md` | Floating `Dropdown` menus, popovers, and context menus |
| `--elevation-lg` | Centered modal dialogs |
| `--elevation-drawer` | Full-height slide-over drawers (`RecruiterShellPreview` overlay) |
| `--semantics-focus-ring` | Form input focus halo (`--semantics-focus-ring-danger` when invalid) |

---

## 5. Correct vs. Incorrect

```css
/* Correct — pure semantic tokens, zero fallbacks */
.card {
  background: var(--semantics-surface-primary);
  border: var(--border-width-thin) solid var(--semantics-border-default);
}
.card:hover {
  border-color: var(--semantics-border-strong);
  box-shadow: var(--elevation-sm);
}

/* Incorrect — primitive leak, hardcoded rgba shadow, hex fallback */
.card {
  background: var(--semantics-surface-primary, #ffffff);
  border: 1px solid var(--primitives-neutral-200);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}
```
