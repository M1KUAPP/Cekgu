# Agent tooling

Standing reference for RTK, kept out of [`AGENTS.md`](../../AGENTS.md) so it is not reloaded into every session. It is
**optional and per-machine**: not a dependency of this repo, and every command documented anywhere in it works without
it.

## RTK, the Rust Token Killer

RTK is a CLI proxy that filters verbose command output, cutting the tokens an agent spends reading it.

### Only use RTK if it is installed

Check with `which rtk`. Not every teammate has it. If it is missing, run commands directly and ignore this whole
section.

**Prefix commands with `rtk`.** If RTK has a filter for that command it uses it, otherwise it passes through unchanged.
It is always safe to use.

Use it inside chains too:

```bash
# Wrong
git add . && git commit -m "msg" && git push

# Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

### RTK commands that matter here

```bash
rtk git status / log / diff / add / commit / push    # 59 to 80 percent smaller
rtk gh pr view <n> / pr checks / issue list          # 26 to 87 percent
rtk tsc                                              # TS errors grouped by file
rtk lint                                             # Biome violations grouped
rtk bun run test                                     # failures only
rtk ls / read / grep / find                          # 60 to 75 percent
rtk err <cmd>                                        # errors only from any command
rtk gain                                             # savings so far
```

Git and `gh` passthrough works for every subcommand, including ones not listed.

### RTK does not defeat the git guard, but it does defeat the deny list

`.claude/hooks/guard-git.sh` matches on the command substring, so `rtk git push origin main` and `rtk git add .env` are
both blocked exactly like their bare forms. Verified 2026-08-26.

The `permissions.deny` list in `.claude/settings.json` is prefix-matched, so `Bash(git push --force*)` does **not**
match `rtk git push --force`. The hook is what actually stops that one, which is why both exist.
