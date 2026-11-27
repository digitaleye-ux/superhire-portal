# Forms & Selection Controls

All form controls live in [`@/components/shared`](../../src/components/shared/index.ts) and consume `--semantics-control-*` tokens.

---

## Choosing a Selection Control

```text
How many options, and single vs. multi-select?
 ├── Searchable text query ──────────────────────────────────► <SearchInput>
 ├── Freeform text / number / email / URL ───────────────────► <Input>
 ├── Multi-select
 │    ├── Compact toolbar filter (1+ criteria in a bar) ─────► <Dropdown multiple>
 │    └── Visible form checklist (2–6 options on canvas) ────► <Checkbox> group
 └── Single-select
      ├── 2–4 short modes/slices in a toolbar or form ───────► <SegmentedControl>
      ├── 2–5 options visible simultaneously in a form ──────► <Radio> group
      └── 4+ options or compact toolbar sort/filter ─────────► <Dropdown multiple={false}>
```

---

## Input (`@/components/shared/Input`)

Use for single-line text, email, phone, URL, or numeric entry. For search bars with a clear button, use `SearchInput`.

Sizes: `lg` (`40px`, default — standard form fields), `md` (`36px`), `sm` (`32px` — compact toolbars). Nothing else exists.

- Pass `label` for form fields; `Input` automatically wires `htmlFor`, `aria-invalid`, and `aria-describedby` for `hint` / `error`.
- Use `leadingIcon`, `trailingIcon`, or `suffix` (e.g. `"LPA"`, `"Years"`) instead of wrapping `<input>` in custom relative `<div>`s.

```tsx
// Correct — lg default in forms, error message wired via prop
<Input label="Expected CTC" suffix="LPA" value={ctc} onChange={onCtcChange} error={errors.ctc} />

// Incorrect — raw <input> with manual error border and off-scale size="xl"
<Input size="xl" className="border-red-500" />
```

---

## SearchInput (`@/components/shared/SearchInput`)

Use for live keyword filtering in `PageHeader` or table toolbars. Built on `Input` with a leading `SearchIcon` and interactive clear (`XIcon`) button.

- Default size in `PageHeader`: `lg` (`40px`). In compact card toolbars alongside `Dropdown` (`32px`), pass `size="sm"`.

```tsx
// Correct — compact toolbar search matching 32px Dropdown height
<SearchInput
  size="sm"
  placeholder="Search candidate, role, or employer"
  ariaLabel="Search commission ledger"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onClear={() => setSearchQuery("")}
/>

// Incorrect — building a custom <Input leadingIcon={<SearchIcon />} /> without clear button
<input type="search" placeholder="Search..." />
```

---

## Dropdown (`@/components/shared/Dropdown`)

Use for toolbar filters (`variant="filter"`, default), input-style form selectors (`variant="form"`), and borderless table triggers (`variant="plain"`).

### Visual Variants (`DropdownVariant`)
- `filter` (default): Secondary button style with active brand tint (`--semantics-surface-brand-subtle`), selected counter badge, and clear `×` button.
- `form`: Standard form field style matching `Input` (`--semantics-control-bg`, `--semantics-control-border`). Displays active selection or `placeholder` with rotating chevron indicator.
- `plain`: Borderless resting frame with hover highlight, ideal for compact table header sorting.

### Sizes (`DropdownSize`)
- `sm` (`32px`, height `--dropdown-height-sm`, default): Compact toolbars, filter bars, table headers.
- `md` (`36px`, height `--dropdown-height-md`): Dialogs, drawers, standard forms.
- `lg` (`40px`, height `--dropdown-height-lg`): Primary form layouts matching `Input` `size="lg"`.

### Features & State Coverage
- `multiple={true}` (default) — renders `Checkbox` items, shows selected count pill (`2+`) and inline clear (`×`) button on the trigger.
- `multiple={false}` with `singleShowsValue` — renders `Radio` items and displays the active option label on the trigger. Pass `defaultValue` when an `"all"` option should keep the trigger in its neutral resting state.
- `leadingIcon?: ReactNode` — leading icon slot before the label.
- `fullWidth?: boolean` — stretches root and trigger to 100% width.
- `align?: "left" | "right"` — anchors menu to left or right edge.
- **Full 6-state coverage:** `default`, `hover`, `active`, `open`, `focus-visible`, `disabled`, and `invalid` (with optional `error` message).

```tsx
// Correct — toolbar multi-select filter
<Dropdown
  label="Location"
  options={LOCATION_OPTIONS}
  selected={selectedLocations}
  multiple={true}
  onChange={setSelectedLocations}
/>

// Correct — full-width form selector with leading icon
<Dropdown
  variant="form"
  size="lg"
  fullWidth
  label="Notice period"
  placeholder="Select notice period"
  leadingIcon={<CalendarIcon size="sm" />}
  options={NOTICE_OPTIONS}
  selected={[notice]}
  multiple={false}
  singleShowsValue
  onChange={(vals) => setNotice(vals[0] || "")}
/>

// Incorrect — native <select> element inside a filter toolbar
<select value={datePreset}><option value="this-year">This year</option></select>
```

---

## Checkbox & Radio (`@/components/shared/Checkbox`, `@/components/shared/Radio`)

Use `Checkbox` (`16px` rounded-`4px` square) for independent boolean toggles or multi-select lists, and `Radio` (`16px` circle) for visible single-select groups sharing a `name` attribute.

- Always pass `label: string`; never render an unlabeled bare control without `aria-label`.
- Both forward `ref` to the native `<input>` and support `checked`, `onChange`, `disabled`, and `aria-invalid`.

```tsx
// Correct
<Checkbox label="Immediate joiner" checked={immediate} onChange={(e) => setImmediate(e.target.checked)} />
<Radio name="work-mode" label="Remote" checked={mode === "remote"} onChange={() => setMode("remote")} />

// Incorrect — using Checkbox for mutually exclusive options
<Checkbox label="Remote" checked={mode === "remote"} />
<Checkbox label="On-site" checked={mode === "onsite"} />
```
