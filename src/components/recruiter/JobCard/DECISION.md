# Job Card direction — decided from /?proto=jobcard

**Chosen: Baseline** — the current Figma card (node 374:2067), unchanged in form.
Border for separation, inline meta row, commission in the footer, the "Claim job"
action revealed on hover/focus.

## Rejected
- **Elevated** — borderless, shadow-based lift, persistent primary claim button.
  Good for a tappable browsing grid, but reads more "consumer app" than the crisp
  recruiter dashboard; added visual weight wasn't wanted.
- **Dense** — compact list row, commission as right-aligned scan anchor. Strong for
  long lists, but it stops being a card and changes the grid into rows.
- **Editorial** — role title as hero, large commission figure, generous whitespace.
  Right for a small "featured jobs" set; eats too much vertical space for the main list.

## Follow-up carried into the real component
Baseline's one known weakness (flagged during the exploration): the claim action is
hover-only, so it is invisible on touch and on first glance. Tracked separately from
this decision. Edge-case hardening (long text, missing data, optional badge/claim)
applied to the real component after this decision.
