# Earnings Section — Architectural Decision Record

## Context
The previous earnings card suffered from excessive complexity, displaying multiple overlapping states (earned condition met, 30-day verification timers, legalistic disclaimers, and candidate-level sub-bullets) in nested containers.

Using `/emil-prototype`, four divergent directions were prototyped and evaluated in-place on the Recruiter Dashboard overview page:
1. **Dual Block** (Symmetrical Two-Column Split): Equal side-by-side blocks for Earned and Potential.
2. **Pipeline Progress** (Conversion Funnel & Visual Progress Bar): Single unified pipeline value with proportional conversion progress bar.
3. **Stacked Cashflow** (Realized Cash Hero + Pipeline Deck): Asymmetrical hierarchy separating realized bank cash from unrealized pipeline.
4. **Segmented Focus** (Single-Perspective Tabbed Focus): Single card switching between Earned and Potential via tab pills.

## Decision
- **Chosen Direction**: **Pipeline Progress**
- **Token Rule**: Strictly uses Bolt Design System tokens (`var(--primitives-success-*)`, `var(--primitives-primary-*)`, `var(--semantics-badge-success-*)`) with zero ad-hoc hex values.

### Specification:
- **Total Pipeline Value**: `₹14,53,000` displayed prominently on top, paired with an inline status badge displaying realized conversion: `₹2,62,000 earned (18%)` using `var(--semantics-badge-success-bg)` & `text`.
- **Proportional Funnel Progress Bar**:
  - **Earned**: `var(--primitives-success-500)` (Figma green `#10B981`)
  - **Pipeline / Potential**: `var(--primitives-primary-300)` (Figma primary `#BDB4FE`)
  *(Removed previous intermediate light green "pending" sliver to create an exact 1:1 match with the Earned vs Potential cards below).*
- **Interactive Breakdown Cards**:
  - **Earned Card**: Sub-total `₹2,62,000` with horizontal separator, followed by a two-column split separated by a vertical divider (`Paid: ₹2,09,000` | `Pending: ₹53,000`). Clicking opens the ledger filtered to `earned`.
  - **Potential Card**: Sub-total `₹11,91,000` with horizontal separator, followed by a two-column split separated by a vertical divider (`Shortlist: ₹81,000` | `Closure: ₹11,10,000`). Clicking opens the ledger filtered to `potential`.
- **Vertical Space Utilization**:
  - Configured `.twoColSplit` to `align-items: stretch` so the Earnings card seamlessly matches the height of Recent Candidate Progress.
  - Added an upcoming payout schedule meta banner at the bottom (`Next scheduled payout: 28 Nov 2026`).

## Rejected Options
- **Dual Block**: Rejected because it treated realized cash and unrealized future potential with equal visual presence and did not convey conversion velocity.
- **Stacked Cashflow**: Rejected because the stacked vertical format consumed too much vertical space compared to the neighboring candidate progress list.
- **Segmented Focus**: Rejected because hiding one of the key numbers behind a tab required manual clicks to compare total pipeline against earned cash.
