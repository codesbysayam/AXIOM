# Google AI Studio Build Prompt

Build the reference design as a production-quality React + TypeScript + Vite web page.

## Reference

The target is the supplied reference showing:

- a warm, slightly creamy off-white paper background
- very faint vertical layout/grid guide lines
- a large red `01` at the upper left
- the serif heading `Agentic AI`
- a muted grey paragraph below the heading
- a thin horizontal divider
- eight compact rows of monospace text separated by thin rules

The visual target is editorial, restrained, and human-designed. It must NOT look like an AI-generated SaaS dashboard.

## Exact visible content

Number:
`01`

Heading:
`Agentic AI`

Description:
`Systems where AI agents reason, plan, use tools and finish useful work with proper human oversight. Judged on how useful the agent is, how well it is orchestrated, how reliably it runs, and how clearly a human stays in control.`

Rows, in this exact order:

1. `Research and knowledge agents`
2. `Customer-support agents`
3. `Personal productivity assistants`
4. `Multi-agent collaboration`
5. `Business-process automation`
6. `Developer and coding agents`
7. `Responsible autonomous workflows`
8. `Industry-specific copilots`

## Layout requirements

- Recreate the reference composition rather than inventing a new dashboard.
- Use a warm paper background close to `#f2eee4`.
- Add extremely subtle vertical guide lines. They should be barely visible and never compete with the content.
- Keep the main content left aligned.
- Use generous but controlled whitespace.
- The red section number should be the strongest visual element.
- Use an editorial serif font for `Agentic AI`. Do not use futuristic display fonts.
- Use a neutral sans-serif for body copy.
- Use a monospace stack for the eight topic rows.
- Use thin, low-contrast horizontal rules around the topic list.
- Do not add gradients, glass cards, glowing borders, neon colors, 3D effects, blobs, excessive shadows, pills, badges, dashboard sidebars, or decorative AI imagery.
- Do not add stock illustrations.
- Do not use emoji as decoration.

## Responsive behavior

The implementation must work cleanly from 320px mobile widths through large desktop screens.

- Preserve the left-aligned editorial hierarchy.
- Scale the number and heading using `clamp()`.
- Keep paragraph measure readable rather than stretching it across the entire desktop viewport.
- Topic rows must never overflow horizontally.
- Maintain adequate touch targets on mobile.
- Keep the visual density close to the reference at every breakpoint.

## Interaction

Make every topic row an accessible button. On click, it reveals concise explanatory information below the row. The opened state uses the same typography and rules as the rest of the page. Do not turn the rows into cards.

Requirements:

- `aria-expanded`
- `aria-controls`
- keyboard focus state
- `Escape` closes open rows
- respect `prefers-reduced-motion`

## Typography rules

Use real, conventional web typography:

- Heading: Cormorant Garamond, Georgia, 'Times New Roman', serif
- Body: Plus Jakarta Sans, 'Helvetica Neue', Helvetica, Arial, sans-serif
- Rows: IBM Plex Mono, ui-monospace, SFMono-Regular, Consolas, monospace

Do not use futuristic fonts, sci-fi fonts, or excessive all-caps labels.

## Color rules

Use a restrained palette:

- paper: `#f2eee4`
- dark ink: `#17243b`
- muted text: `#687486`
- divider: `#ded8cb`
- section red: `#ef2636`
