final result: blocked

The quote app builds successfully with `npm.cmd run build`.

Visual browser QA was blocked by the local in-app browser/runtime environment:
- The in-app browser connection exited unexpectedly during preview.
- Background local servers started from this sandbox did not stay alive long enough for screenshot capture.

Manual review checklist for the next local browser pass:
- A4 preview renders as one 210mm x 297mm sheet.
- Editor panel is hidden in print/PDF output.
- Quote item add/delete/highlight controls update the A4 preview.
- Total reflects the sum of item prices.
- Print dialog can save the visible A4 sheet as PDF.
