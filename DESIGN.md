# Bolt Design System (`DESIGN.md`)

Bolt is SuperHire's high-density workspace design system (`Inter` typography, restrained neutral surfaces, electric violet `#6938EF` interactive accents, and crisp `1px` structural borders). Every screen prioritizes scannable recruiter workflows, tabular financial precision, and zero visual clutter.

---

## Non-Negotiable Rules (Read First)

1. **Consume semantic and component tokens only.** All tokens live in [`src/tokens/tokens.css`](src/tokens/tokens.css).
   - **Allowed in components:** `--semantics-*`, `--space-*`, `--radius-*`, `--size-icon-*`, `--border-width-*`, `--elevation-*`, `--duration-*`, `--easing-*`, `--button-*`, `--icon-button-*`, `--link-button-*`, `--control-*`, `--dropdown-*`, `--segmented-*`, `--tag-*`, and `.text-style-*`.
   - **Banned in components:** `--primitives-*`, `--spacing-*`, raw hex/RGB/HSL values (`#fff`, `rgba(...)`), CSS fallbacks with hardcoded hexes (`var(--semantics-text-primary, #0f172a)`), and off-scale pixel values (`11px`, `13px`, `15px`, `18px`).
   - *Why:* Primitives and hardcoded fallbacks silently break theme overrides and hide missing token bugs.
2. **Reuse `@/components/shared` before writing custom controls.** Never build a `<button>`, `<input>`, badge `<span>`, tab strip, or toggle pill by hand when a shared component exists.
3. **Close every variant and size union.** Documented variants map 1:1 to TypeScript union types in `src/components/shared/`. An unlisted variant or size is a bug, not an option.
4. **Every interactive component must define all 6 states via tokens:** `default`, `:hover:not(:disabled)`, `:active:not(:disabled)`, `:focus-visible`, `:disabled` / `[aria-disabled="true"]`, and (for form controls) `[aria-invalid="true"]` / `data-invalid`.
5. **Financial figures, counts, and timestamps always set `font-variant-numeric: tabular-nums`.** Column alignment breaks without tabular numerals.
6. **Figma parity (`R4SLa0NOU3UHMfnEFJJmxp`).** Any new token or component added in code must be mirrored in the **Bolt | Design System** Figma file with explicit variable scopes (never `ALL_SCOPES`) and `WEB` `codeSyntax` (`var(--...)`).

---

## Documentation Index

Load only the file needed for your current task:

| Topic | File | Covers |
| :--- | :--- | :--- |
| **Colors, Surfaces & Elevation** | [`docs/design-system/colors-and-surfaces.md`](docs/design-system/colors-and-surfaces.md) | Surface hierarchy, text contrast roles, border rules, shadows, and scrims |
| **Typography, Spacing & Motion** | [`docs/design-system/typography-and-spacing.md`](docs/design-system/typography-and-spacing.md) | Typescale (`10px`–`40px`), `.text-style-*` classes, `--space-*` scale, radii, motion |
| **Actions & Navigation** | [`docs/design-system/actions-and-navigation.md`](docs/design-system/actions-and-navigation.md) | `Button`, `Tab` vs `SegmentedControl`, `NavItem`, `SideNavbar`, `PageHeader` |
| **Forms & Selection Controls** | [`docs/design-system/forms-and-controls.md`](docs/design-system/forms-and-controls.md) | `Input`, `SearchInput`, `Dropdown`, `Checkbox`, `Radio` |
| **Status Indicators, Tags, Icons & Authoring** | [`docs/design-system/status-and-icons.md`](docs/design-system/status-and-icons.md) | `Badge`, `Tag`, `Icon`, state checklist for new components, Figma sync contract |
| **Figma Node Manifest** | [`docs/DESIGN_SYSTEM_FOUNDATIONS.md`](docs/DESIGN_SYSTEM_FOUNDATIONS.md) | Figma node IDs, variable collection map, and component token attachment matrix |
