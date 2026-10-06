# Hooks and standing references

**One repo hook** sits in `.claude/settings.json` beside the org template's: `guard-git.sh` blocks unreviewed pushes to
`main` and `git add .env`. It exits 0 on internal failure, so a broken guard never wedges a session. Next to it,
`permissions.deny` refuses force pushes, hard resets, `rm -rf /`, `gh repo delete` and reads of `.env`.

## Appendix: standing references

Moved out of `AGENTS.md` and its imports so they are not reloaded into every session, apart from the Karpathy
guidelines, which the org template imports. **The `docs/agents/` topic files outrank them wherever they disagree.**

| Reference                               | Lives in                                                                                       | Applies                                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Markdown style guide**                | [`docs/references/markdown-style.md`](../references/markdown-style.md)                         | Every Markdown file in the repo                                                                                                          |
| **Coding guidelines (Andrej Karpathy)** | [`docs/agents/andrej-karpathy-skills.md`](andrej-karpathy-skills.md)                           | Always, imported by `AGENTS.md`. Guideline 1 is overridden by **How to work**; see [the override](project.md#coding-guidelines-override) |
| **RTK (Rust Token Killer)**             | [`docs/references/agent-tooling.md`](../references/agent-tooling.md#rtk-the-rust-token-killer) | Only if `which rtk` finds it                                                                                                             |

Two rules from them that change behaviour even if you never open them:

- **Changes are surgical.** Every changed line traces to what was asked. Do not refactor, reformat or improve adjacent
  code you were not sent to touch
- **`rtk` does not defeat the git guard, but it does defeat the deny list.** The hook matches the command substring, so
  `rtk git push origin main` is blocked. The `permissions.deny` entries are prefix-matched and are not. That is why both
  exist
