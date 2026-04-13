<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Accessibility (WCAG 2.1 AA)

All **public** pages must meet WCAG 2.1 AA. Admin pages under `/admin/*` are exempt (single-user, authenticated, noindex).

## Rules for every new public page/component
- Text contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large (18pt+/14pt bold) and UI components.
  - `text-muted-foreground` on `bg-navy-50` = 4.23:1 → **fails**. Use `text-charcoal` instead.
  - `text-white` on `bg-accent-gold` = 2.36:1 → **fails**. Use `text-navy` instead.
- Every `<img>` has `alt=""` (decorative) or descriptive alt text.
- Every icon-only button/link has `aria-label`; inline icons next to text use `aria-hidden="true"`.
- Every form input has a real `<label>` (or `sr-only` label) tied via `htmlFor` / wrapping.
- Heading order is sequential: one `<h1>` per page, no skipping levels.
- Interactive elements are reachable by keyboard; focus ring is visible (do not remove `focus:ring-*`).
- Modal/dialog/drawer: focus trap + `Escape` to close + restore focus to trigger.
- Color is never the sole signal — pair with text/icon (e.g., status badges have label text, not just a dot).
- Links that open new tabs: `rel="noopener noreferrer"` + `aria-label` noting "opens in new tab".

## Verification (required before deploy)
```bash
npm run build        # must succeed
npm run audit:a11y   # pa11y-ci against all public URLs in .pa11yci.json
```
If `audit:a11y` reports any errors, fix them before deploying. When adding a new public route, append it to `.pa11yci.json`.

## Out of scope
- `/admin/*` routes and `/api/admin/*` endpoints — skip a11y work there.
