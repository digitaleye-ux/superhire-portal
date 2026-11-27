# Actions & Navigation Components

All components below are exported from [`@/components/shared`](../../src/components/shared/index.ts).

---

## Button (`@/components/shared/Button`)

Use for actions that mutate state, submit forms, open modals, or reset filters. Navigation to another route/section styled as text is a link or `NavItem`; mutually exclusive view switches use `SegmentedControl`.

Variants: `primary`, `secondary`, `tertiary`. Sizes: `xs` (`28px`), `sm` (`32px`), `md` (`36px`, default), `lg` (`40px`). Nothing else exists — an unlisted variant or size is a bug, not an option.

```text
Which Button variant?
 ├── Is it the single primary CTA in this view/drawer? ──► variant="primary" (at most ONE per view/panel)
 └── Everything else
      ├── Needs a visible border (toolbar reset, modal cancel, secondary CTA)? ──► variant="secondary" (default choice for secondary actions)
      └── Low-emphasis inline/back action inside a header or dense bar? ─────────► variant="tertiary"
```

```tsx
// Correct — secondary for filter resets, leadingIcon via prop
<Button variant="secondary" size="sm" onClick={clearAllLedgerFilters}>
  Clear filters
</Button>

// Incorrect — "ghost" and "outline" do not exist; raw <button> duplicates tokens
<Button variant="ghost" size="small">Clear filters</Button>
```

---

## LinkButton (`@/components/shared/LinkButton`)

Use for lightweight, inline text-link actions that do not warrant a full boxed button frame:
- Card footer actions (`Claim role →`, `Add another role →`, `View all →`)
- Table row secondary inline triggers
- Inline text links with leading or directional trailing icons

Never construct an ad-hoc `<button className={styles.claim}><ArrowRightIcon /></button>` or raw styled `<a>` by hand when a `LinkButton` is required.

Variants (`LinkButtonVariant`):
- `brand` (default) — primary interactive violet (`var(--semantics-text-link)` -> hover `var(--semantics-text-link-hover)`).
- `neutral` — understated slate action (`var(--semantics-text-secondary)` -> hover `var(--semantics-text-primary)`).
- `danger` — destructive inline action (`var(--semantics-text-error)` -> hover `var(--primitives-error-700)`).

Sizes (`LinkButtonSize`):
- `sm` (`12px`, icon `12px`) — dense table rows, compact secondary callouts.
- `md` (`14px`, icon `16px`, default) — card footers (`JobCard`, `CandidateCard`), drawer triggers. Matches `.text-style-label-2`.
- `lg` (`16px`, icon `20px`) — section header triggers, prominent inline navigation.

Underline Options (`LinkButtonUnderline`):
- `none` (default) — clean text link.
- `hover` — underlines on `:hover`.
- `always` — permanently underlined for high-discoverability prose integration.

Micro-Interactions:
- Smooth color transition on hover (`var(--duration-fast)` `var(--easing-default)`).
- **Directional glide:** When `arrow` or `trailingIcon` is present, the trailing arrow automatically glides right by `2px` on hover (`transform: translateX(2px)`).
- **Focus visible:** High-contrast outline ring `var(--link-button-focus-ring)` with `2px` offset and `var(--radius-2)`.

```tsx
// Correct — card footer action with directional arrow
<LinkButton
  variant="brand"
  size="md"
  arrow
  onClick={(e) => {
    e.stopPropagation();
    handleClaim();
  }}
>
  Claim role
</LinkButton>

// Correct — polymorphic anchor link to external page or route
<LinkButton
  as="a"
  href="/jobs/123"
  variant="neutral"
  size="sm"
  underline="hover"
>
  View job posting
</LinkButton>
```

---

## IconButton (`@/components/shared/IconButton`)

Use for circular single-icon click actions: modal and drawer close buttons, kebab (`⋮`) overflow action triggers, item dismissals, and inline actions. Never construct a `<button className={styles.closeBtn}><XIcon /></button>` by hand.

Sizes (`IconButtonSize`):
- `xs` (`28px`, icon `12px`) — compact card headers, table action columns.
- `sm` (`32px`, icon `16px`, default) — card kebab overflow menus (`⋮`), toolbar action icons.
- `md` (`36px`, icon `20px`) — side panel and drawer close buttons, modal dialog header close buttons.
- `lg` (`40px`, icon `20px`) — prominent action triggers.

Visual Variants (`IconButtonVariant`):
- `default` (clean borderless circular frame with `--semantics-surface-primary` background).
- `bordered` (circular frame with 1px `--semantics-border-default` stroke).
- `ghost` (transparent resting frame, tinted on hover).

Micro-States:
- **Default:** Fill `--icon-button-background` (`#FFFFFF`), Icon `--icon-button-color` (`#475569`), Border `--icon-button-border` (`transparent`).
- **Hover:** Fill `--icon-button-background-hover` (`#F8FAFC`, `neutral/50`), Icon `--icon-button-color-hover` (`#0F172A`, `text/primary`), Border `--icon-button-border-hover` (`transparent`).
- **Active:** Fill `--icon-button-background-active` (`#F1F5F9`), scale `0.96`.
- **Focus-visible:** Outline `--icon-button-focus-ring` (`#6938EF`), offset `2px`.
- **Disabled:** Fill `--icon-button-background-disabled`, `cursor: not-allowed`.

```tsx
// Correct — side panel & modal close button
<IconButton
  icon={<XIcon size="md" />}
  ariaLabel="Close job details"
  size="md"
  onClick={onClose}
/>

// Correct — kebab menu trigger with active state on cards
<IconButton
  icon={<MoreVerticalIcon size="sm" />}
  ariaLabel="More candidate actions"
  size="sm"
  active={menuOpen}
  onClick={() => setMenuOpen(!menuOpen)}
/>
```

---

## SegmentedControl vs. Tab

```text
Am I switching structural content panes or toggling a display/filter parameter?
 ├── Swapping entire content views (e.g., "Job details" vs "Company details") ──► <Tab> inside role="tablist"
 └── Toggling a toolbar slice, chart granularity, or binary form option ────────► <SegmentedControl>
```

### SegmentedControl (`@/components/shared/SegmentedControl`)

Use for 2–4 mutually exclusive mode, granularity, or toolbar slice switches (`Monthly` / `Quarterly`, `All` / `Earned` / `Potential` / `Ineligible`). For 5+ options or multi-select, use `Dropdown`.

Sizes: `sm` (`32px`, default — matches toolbar `Dropdown` height), `md` (`36px`), `lg` (`40px`).

```tsx
// Correct — toolbar slice filter with tabular counts
<SegmentedControl
  size="sm"
  ariaLabel="Filter by earning eligibility"
  value={ledgerEarningTab}
  onChange={setLedgerEarningTab}
  options={[
    { value: "all", label: "All", count: 13 },
    { value: "earned", label: "Earned", count: 4 },
  ]}
/>

// Incorrect — custom div + button loop with aria-pressed
<div className={s.segmentedGroup}><button className={s.segmentBtn}>All</button></div>
```

### Tab (`@/components/shared/Tab`)

Use inside a `<nav role="tablist">` with a `1px solid var(--semantics-border-default)` bottom border to switch structural panels (`JobDetail`, `SubmitCandidate`, candidate drawers). Never use inside a padded toolbar next to inputs.

Props: `label: string`, `active?: boolean` (default `false`), `count?: number | string`, `disabled?: boolean`. No `variant` or `size` props exist.

```tsx
// Correct
<nav className={styles.tabs} role="tablist" aria-label="Job and company">
  <Tab label="Job details" active={tab === "job"} onClick={() => setTab("job")} />
  <Tab label="Company details" active={tab === "company"} onClick={() => setTab("company")} />
</nav>

// Incorrect — pill tabs do not exist on <Tab>; use <SegmentedControl> instead
<Tab label="Job details" variant="pill" />
```

---

## SideNavbar, NavItem & PageHeader

- **`SideNavbar`** (`@/components/shared/SideNavbar`) — Primary `80px`-wide left portal rail (`items`, `footerItems`, `activeId`, `onSelect`, `user`). One per portal shell.
- **`NavItem`** (`@/components/shared/NavItem`) — `80px × 80px` rail tile consumed by `SideNavbar`. Never use for in-page tabs or breadcrumbs.
- **`PageHeader`** (`@/components/shared/PageHeader`) — Standard top bar for collection pages (`Explore`, `Claimed`, `Track`) with `title` (`.text-style-heading-2`), optional `search`, and `actions`. Custom workspace headers (such as `Earnings` with a lifetime KPI block) must match its `var(--space-8x)` padding and `.text-style-heading-2` title.
