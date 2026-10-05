# Skills, subagents and hooks

**38 skills are committed** and all are optional: invoke one when the task matches, not as a checkpoint before every
action. Your tool already lists them with descriptions, so the inventory is not repeated here. Provenance, what was
retargeted, what was deliberately not taken, and what each hook does:
[`.agents/skills/VENDORED.md`](../../.agents/skills/VENDORED.md).

Three things the listing does not tell you:

- **`brainstorming` is not the ideation skill.** It shapes a build once a concept is locked. The eight business skills
  are what concept selection runs on
- **Taste sets the target, `impeccable` hits it.** Do not start with `impeccable`
- **The `hackathon-*` skills were retargeted.** Their bodies still name a different event's rules. The `> ## This Event`
  block at the top of each wins

**One subagent.** `pitch-smith` owns `docs/demo/` — the pitch script, the deck, the PDF and the 2-minute video script,
and nothing else. Dispatch it once the build is frozen, or earlier to draft against what already works.

**Four hooks** are wired in `.claude/settings.json`, each exiting 0 on internal failure so a broken guard never wedges a
session. Only one can stop you: `guard-git.sh` blocks unreviewed pushes to `main` and `git add .env`. The other three
are informational.

## Appendix: standing references

Moved out of `AGENTS.md` and its imports so they are not reloaded into every session, apart from the Karpathy
guidelines, which the org template imports. **The `docs/agents/` topic files outrank them wherever they disagree.**

| Reference                               | Lives in                                                                                                 | Applies                                                                                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Markdown style guide**                | [`docs/references/markdown-style.md`](../references/markdown-style.md)                                   | Every Markdown file in the repo                                                                                                          |
| **Coding guidelines (Andrej Karpathy)** | [`docs/agents/andrej-karpathy-skills.md`](andrej-karpathy-skills.md)                                     | Always, imported by `AGENTS.md`. Guideline 1 is overridden by **How to work**; see [the override](project.md#coding-guidelines-override) |
| **RTK (Rust Token Killer)**             | [`docs/references/agent-tooling.md`](../references/agent-tooling.md#rtk-the-rust-token-killer)           | Only if `which rtk` finds it                                                                                                             |
| **Graphify**                            | [`docs/references/agent-tooling.md`](../references/agent-tooling.md#graphify-a-codebase-knowledge-graph) | Only if `which graphify` finds it, and only once there is real code                                                                      |

Two rules from them that change behaviour even if you never open them:

- **Changes are surgical.** Every changed line traces to what was asked. Do not refactor, reformat or improve adjacent
  code you were not sent to touch
- **`rtk` does not defeat the git guard, but it does defeat the deny list.** The hook matches the command substring, so
  `rtk git push origin main` is blocked. The `permissions.deny` entries are prefix-matched and are not. That is why both
  exist
