# Design QA — Contact Us Page

## Comparison target

- Source visual truth: user-provided Contact Us master-reference images in the conversation; no local filesystem path was exposed for the attachments.
- Primary source dimensions: 538 × 718 px for the supplied full-page desktop reference (scaled reference capture).
- Implementation: `contact.html`, served successfully from the local workspace preview.
- Intended comparison viewport: 1440 × 1000 CSS px, device scale factor 1.
- State: desktop, Step 1 — Business Information active.
- Pre-fix implementation screenshot: user-provided conversation attachment, 1900 × 907 px.
- Post-fix implementation screenshot path: unavailable because the in-app browser reported no available browser surface.
- Implementation pixel dimensions and density normalization: unavailable; no browser-rendered capture could be produced.

## Full-view comparison evidence

Blocked. The source reference is visible in the conversation, but the implementation could not be opened or captured in the required in-app browser. HTTP status and source-code inspection are not substitutes for browser-rendered visual evidence.

## Focused-region comparison evidence

Blocked for the same reason. The hero/form region, step transitions, process section, FAQ section, and responsive states could not be captured at matching viewports.

## Findings

- [P1] Browser-rendered visual fidelity is unverified.
  Location: full Contact Us page.
  Evidence: local HTML, CSS, and JavaScript return HTTP 200, but no implementation screenshot is available to compare with the master reference.
  Impact: typography, actual spacing, wrapping, responsive overflow, image crop, and interaction states may still contain visible differences.
  Fix: open `contact.html` in the in-app browser, capture Step 1 at 1440 × 1000, capture Steps 2 and 3, then capture mobile at 390 × 844 and compare each against the reference.

## Required fidelity surfaces

- Fonts and typography: Inter and the existing Avantheon display font stack are preserved; visual rendering, wrapping, and optical weight remain unverified.
- Spacing and layout rhythm: source values were refined for a compact two-column hero, stable form card, compact process card, and two-column FAQ card; browser-rendered geometry remains unverified.
- Colors and visual tokens: existing navy, gold, white, and muted-blue tokens are reused; final contrast and compositing remain unverified.
- Image quality and asset fidelity: the existing logistics background and brand assets are reused; crop and sharpness remain unverified.
- Copy and content: all requested fields, three steps, four follow-up stages, FAQs, TRN verification guidance, consent, and submit action are present.

## Static and interaction checks completed

- `contact-page.js` passes `node --check`.
- `git diff --check` reports no whitespace errors.
- CSS opening and closing brace counts match (3481 / 3481).
- Contact page, stylesheet, and script each return HTTP 200 from the local preview.
- All requested contact-field IDs are present.
- Exactly three form panels and four FAQ items are present.
- Inactive panels receive `aria-hidden` and `inert`; the active step receives `aria-current="step"`.
- FAQ items use single-open accordion behavior.

## Comparison history

- Iteration 1: code and static QA completed; visual comparison blocked before a first browser-rendered capture, so no P0/P1/P2 visual fixes can be certified.
- Iteration 2: the user supplied a 1900 × 907 pre-fix capture showing the form stretched from roughly x=674 to the right viewport edge and the intro heading clipped against the left edge. The full-width override was replaced with a centered 1180px content frame, a 360px intro column, a maximum 760px form column, smaller heading scale, and denser form spacing. Post-fix browser evidence remains unavailable, so the result cannot yet be certified.

## Implementation checklist

- Capture desktop Step 1, Step 2, and Step 3 in the in-app browser.
- Test validation, Continue, Back, solution/timeline selection, consent, and FAQ accordion behavior.
- Capture the mobile layout and check horizontal overflow and form focus behavior.
- Check browser console errors.
- Compare reference and implementation together, then resolve any P0/P1/P2 differences.

## Follow-up polish

- Revisit only minor P3 refinements after the required browser comparison passes.

final result: blocked
