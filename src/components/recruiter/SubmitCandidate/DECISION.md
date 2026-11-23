# Submit Candidate panel — decided from /?proto=submit

**Chosen: One scroll + Resume-first prefill.**
A single scrollable form with the resume dropzone pinned at the top of the body so uploading a resume prefills most candidate fields before the recruiter reviews and submits.

- **Layout:** Sticky header (company logo, company name, close button, "Submit candidate" title, role subtitle), single-scroll body (resume upload hero → Basic information → Employment details → Other details → Qualifying criteria), sticky footer (commission + primary "Submit candidate" button).
- **Inputs:** Bolt `Input` spec (Figma node 438:5522) — 14px/20 tertiary label, 8px gap, 40px height, 1px `#e5e7eb` border, 8px radius, 16px regular input text (no iOS zoom), overlay prefixes/suffixes, late validation.

## Rejected
- **Guided (step-by-step):** Reduces initial visual density, but forces 4 clicks (`Next`) to reach criteria or inspect parsed fields and hides the overall form length.
- **Resume-first with accordions:** Collapsible sections made recruiters open panels manually to verify prefilled values and added extra chrome inside the 50%-width split pane.
