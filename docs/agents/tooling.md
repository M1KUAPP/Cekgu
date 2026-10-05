# Tooling

Contents:

1.  [Tech stack and commands](#tech-stack-and-commands)
1.  [CLI first, always](#cli-first-always)
1.  [Code style](#code-style)

## Tech stack and commands

| Tool                                 | Role                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- |
| **Bun**                              | Package manager and script runner                                         |
| **Biome**                            | Lint and format for JS, TS, JSON, CSS, HTML                               |
| **Prettier**                         | Format for Markdown and YAML, the two Biome does not cover                |
| **TypeScript**                       | `tsc --noEmit`; strict, `noUncheckedIndexedAccess`                        |
| **commitlint + husky + lint-staged** | Conventional Commits on `commit-msg`; staged files linted on `pre-commit` |
| **GonkaRouter**                      | The only permitted inference path                                         |

```bash
bun install          # dev tooling; also wires husky hooks
bun run check        # lint, typecheck, test, check:anchors and test:guard, in that order
bun run test:guard   # regression tests for merge and main-branch enforcement
bun run lint         # Biome across the code, Prettier across Markdown and YAML
bun run lint:fix     # Biome fixes and Prettier, writing
bun run format       # the same two, writing
bun run typecheck    # tsc --noEmit
```

**The application stack is chosen and justified in [`docs/TRD.md`](../TRD.md):** Hono and React on Bun, Drizzle on
Neon Postgres, Cloud Run. This table is the tooling around it. There is no Python stack. **Prettier owns Markdown and
YAML, Biome owns everything else**, split by file extension: `.prettierignore` lists every extension Biome owns, so
`prettier --check .` reaches only Markdown and YAML. `.prettierrc.json` is the org template's, byte for byte, and
matches every formatter setting `biome.json` states, so both wrap at 120 and neither can undo the other.
`embeddedLanguageFormatting` is at Prettier's default, so fenced code samples in Markdown are formatted too.

`rtk` and `graphify`, both optional and per-machine, are documented in
[`docs/references/agent-tooling.md`](../references/agent-tooling.md). The repository layout is not written down
anywhere: `README.md` is judge-facing and carries architecture rather than a directory tree. Read it off the tree
itself.

## CLI first, always

Reach for a CLI before a dashboard: `gh` for GitHub, `bun` for Node. Clicking through a dashboard leaves no trace,
cannot be handed to a teammate, and cannot be repeated tomorrow.

**If the CLI is missing, say so immediately and give the install command.** Do not route a human through the web UI as a
workaround.

**If no CLI exists, drive the browser yourself.** Pick by whether the task needs a logged-in session:

- **Behind a login** — Devfolio, the GonkaRouter dashboard, OAuth: Claude in Chrome
- **Our own deployed app** — smoke tests, screenshots, checking a render: Playwright, headless. Scriptable, needs no
  human

Headless Chromium cannot see the desktop browser's cookies, which is the whole reason that split exists.

**Never type a password, card number or API key into a form** for someone, and never accept terms or submit a form on
their behalf. Read the screen, do the navigation, hand back the one action that is theirs. **Screenshot what you did.**

## Code style

- **Biome is authoritative:** single quotes, no semicolons, no trailing commas, 120-char lines, 2-space indent. Do not
  hand-format against it
- **Types:** no `any`; prefer `unknown` plus narrowing. Validate at system boundaries
- **Error handling:** validate at boundaries; do not wrap internal framework calls in try/catch
- **Comments:** default to none. Comment only when the _why_ is non-obvious. Never describe _what_ the code does
- **Changes are surgical.** See [guideline 3](andrej-karpathy-skills.md#3-surgical-changes)
