# Design QA

- Source visual truth: user-provided process-section reference image in the current conversation (no local source path exposed).
- Implementation screenshot: unavailable; the in-app browser returned no available browser surfaces.
- Intended viewport: desktop, approximately 1198 × 499 px for the referenced section crop.
- Source pixels: 1198 × 499 px.
- Implementation pixels / CSS size / density: not captured; density normalization could not be performed.
- State: third step (`Deliver`) active, steps 1–2 complete, step 4 upcoming.

## Findings

- [P1] Browser-rendered comparison is unavailable
  - Location: About page, `#process`.
  - Evidence: the source reference is visible in the conversation, but no browser surface was available to capture the implementation at the matching viewport and state.
  - Impact: typography, exact spacing, image crops, line alignment, animation timing, and active-state glow cannot be verified visually.
  - Fix: open the in-app browser, capture the About-page process section with step 3 active, and compare it side by side with the source reference.

## Required Fidelity Surfaces

- Fonts and typography: implemented to follow the existing Playfair Display and Inter brand system; visual comparison blocked.
- Spacing and layout rhythm: separate four-node timeline and four-card grid implemented; pixel comparison blocked.
- Colors and visual tokens: light ivory, navy, teal, cyan, and gold state palette implemented; rendered sampling blocked.
- Image quality and asset fidelity: all four supplied process photographs are used; crop and rendered sharpness comparison blocked.
- Copy and content: step numbers, labels, titles, descriptions, and state labels match the intended four-step flow.

## Full-view Comparison Evidence

- Source: conversation reference image.
- Implementation: not captured because the in-app browser is unavailable.

## Focused-region Comparison Evidence

- Not available for the same browser-capture blocker.

## Comparison History

- Iteration 1: rebuilt the process section into a separate animated timeline and compact translucent cards, added completed/current/up-next states, image markers, and a synchronized route runner.
- Iteration 2: matched the supplied reference more closely with three fixed segment sparks, staged rail-first transitions, muted completed nodes, multi-ring active-node treatment, active pointer, image-bottom fades, tighter card proportions, and reference-specific ivory/navy/gold/teal/cyan tokens.
- Iteration 3: replaced the unreliable CSS pointer with an explicit SVG down-arrow beneath every active node; replaced steps 1, 2, and 4 with recognizable Bootstrap Icons assets while preserving the approved truck icon; locked all four photographs to a 16:9 crop with per-image focal positions, a stronger lower fade, and the state marker centered across the image edge.
- Post-fix visual evidence: unavailable.

## Implementation Checklist

- Capture the desktop section at the reference viewport with step 3 active.
- Verify node centers align exactly with the process rail.
- Verify card heights, image crops, and title wrapping against the reference.
- Test automatic progression and timeline-button selection.
- Check mobile horizontal timeline behavior and browser console errors.

## Follow-up Polish

- Tune spacing and glow intensity only after a browser-rendered side-by-side comparison is available.

final result: blocked
