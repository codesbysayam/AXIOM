# Design Specification: Agentic AI

## Visual Language

The page follows a restrained editorial index aesthetic rather than a conventional software dashboard.

### Surface

- Base: warm paper `#f2eee4`
- No cards or elevated panels
- No gradients
- No glassmorphism
- No large shadows

### Grid

The background uses vertical guide lines across the layout. They are intentionally low contrast and architectural.

### Type Hierarchy

| Element | Treatment |
|---|---|
| `01` | Bold sans-serif, red `#ef2636`, large display scale |
| `Agentic AI` | Quiet serif, regular weight |
| Description | Neutral sans-serif, muted grey, readable measure |
| Topic rows | Monospace, dark navy ink, compact |

### Spacing

The composition uses a simple vertical rhythm:

number -> title -> description -> topic list

The list begins after a deliberate gap and is bounded by a top rule. Each row is separated by a single 1px rule.

## Responsive Rules

- Desktop: content width capped so the paragraph and topic index retain a strong editorial measure.
- Tablet: preserve hierarchy, adjust outer padding.
- Mobile: reduce display scale and keep topic rows readable without horizontal scrolling.

## Accessibility

- Semantic `main`, `section`, `header`, and heading elements.
- Topic rows are real interactive buttons.
- Expanded state is exposed with `aria-expanded` and `aria-controls`.
- Visible `:focus-visible` treatment.
- Arrow keys allow smooth navigation across the list.
- Escape closes all open rows.
- Reduced-motion users receive static transitions.
