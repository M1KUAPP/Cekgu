# Design standards

Anything a judge can see is held to a professional standard: the demo UI, the README, the deck. **UX and design is 10
points and presentation and clarity is 20**, a fifth of the score, and Demo Day is humans watching a pitch on a
projector.

The bar: **the work must not look generated.** A competent but templated screen has failed the task, not partly done it.
The tells to avoid:

- Warm cream ground, serif display face, terracotta accent
- Near black with a single acid green or vermilion pop
- A purple to blue gradient hero on white
- Inter or Space Grotesk as the safe default
- Everything centre aligned
- One large corner radius on every surface
- A coloured rail down the side of a rounded card
- Numbered markers on content that is not a sequence
- Three items in every list because three feels balanced
- Glassmorphism with no reason for depth
- A dark dashboard with neon chart lines and no data behind them

**Structure must mean something.** If a design uses numbering, an eyebrow, a divider or a state chip, that device has to
carry real information. A numbered list of unordered things is a lie told in layout.

**UI text has its own capitalization rule, separate from the docs.** TitleCase for nav items, buttons, section headings,
card titles, table headers, tab labels, menu items, modal titles and form labels. Sentence case for body copy, helper
text, placeholders, tooltips, errors, empty states and toasts. `Save Changes`, but
`We could not reach the model, try again in a moment.` The sentence-case rule in
[Documentation hygiene](documentation.md#documentation-hygiene) governs Markdown files, not product chrome.

**Claude Code cannot generate images.** Delegate to Codex, which needs no API key:

```bash
codex exec --skip-git-repo-check "<prompt>. Use your image generation tool. Save to /absolute/path/<name>.png"
```

Give it an absolute path, and resize before anything lands in the repo. Art direction comes from the identity section of
[`docs/DESIGN.md`](../DESIGN.md); the `brandkit` skill was deliberately not vendored.

**Nothing visual is done until all three are true.** State them when you report:

1.  A critique against the tells above has run, and its findings are addressed or consciously declined
1.  The screen has been viewed at demo scale, not just in a wide editor pane
1.  Capitalization has been checked against rendered text, not source
