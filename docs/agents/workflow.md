# Workflow

Contents:

1. [How to work](#how-to-work)
1. [The gate before implementation](#the-gate-before-implementation)
1. [How to report](#how-to-report)
1. [How work ships](#how-work-ships)

## How to work

**Proceed without asking** on anything you can name a sensible default for: picking a library, file layout, naming or
approach; installing a dependency; refactoring your own code mid-task; writing tests, docs or types you judge necessary;
fixing a bug in code you are already touching. If two approaches are close, pick one and say which. **A reversible
decision made now beats a correct decision made after a ten minute conversation.**

**Stop and ask only for these six.** If it is not on this list, proceed:

1. **A track requirement is at risk.** Routing inference off GonkaRouter, dropping to one model, or losing the Request
   ID trail
1. **The change would break something already working**, and you cannot avoid it
1. **`bun run lint` or `bun run typecheck` fails and you cannot fix it.** Say what fails and what you tried
1. **Two pieces of work genuinely conflict** and shipping both is impossible
1. **A credential or external account is missing** and you cannot proceed
1. **The work would change the demo** in a way the team has not agreed to

**The bar for shipping.** Work is ready when the checks pass and it does what was asked. It need not be complete,
elegant or final. **Partial work that runs beats finished work still sitting on a branch on 5 September.** If you are
behind, cut scope, not the quality of what ships. **Demo-first:** if it will not appear in the 2-minute video or the
5-minute pitch, it is not a priority.

## The gate before implementation

**No implementation starts until `docs/` holds all three.** Cheap to write, expensive to skip: without them the first
days produce code nobody agreed to, and the deck's required sections get invented at the end from whatever got built.

| File              | Answers                                                                         | Owns                                              |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| `docs/PRODUCT.md` | **Who and why.** The user, their problem, the demo moment, the scope ladder     | The spine. Everything downstream cites it         |
| `docs/PRD.md`     | **What.** Requirements, user stories, acceptance criteria, what is out of scope | Scope. What `hackathon-scope-cutter` cuts against |
| `docs/TRD.md`     | **How.** Architecture, API contracts, data models, schemas, decision rationale  | Technical truth. Canonical over this file         |

`docs/DESIGN.md` is the fourth, and owns the design system: palette, type pairing, radius and border treatment, spacing
scale.

**The gate is binary.** If the three are not all present, the answer to "can I start building" is no. Say so, and write
the missing one. The deck's five required sections map onto these, so writing them now is writing the deck early.

## How to report

If reading your message takes longer than doing the thing, you have cost time.

- **Lead with what happened.** First sentence answers "what is the state of things now?" No preamble, no restating the
  request
- **Three to five sentences** for a normal update. Longer only when something broke and the detail is needed
- **Say what a human should do, or say nothing is needed.** Never leave someone guessing whether they are blocked
- **No status theatre.** Do not narrate steps, list what you rejected, or summarise what you already said
- **When something breaks, give the error verbatim.** Paste the trace, then say in one plain sentence what it means
- **No jargon without a plain-language gloss.** Use the real term once with the plain version attached

## How work ships

**`main` is PR-gated. No stray commits.** `.claude/hooks/guard-git.sh` enforces it locally. Nothing on GitHub enforces
it: `main` has no branch protection or ruleset, and no CI runs on pull requests. GitHub does fix how a PR lands: squash
is the only merge method, the squash commit takes the PR title as its title and the PR body as its message, and merged
branches are deleted. Auto-merge and update-branch are enabled on the repository.

1. **Branch.** `<type>/<short-slug>`, matching the commit types below
1. **Commit** in [Conventional Commits](https://www.conventionalcommits.org/) form: `<type>[scope]: <description>`, a
   single imperative sentence, lowercase, no trailing period. `commitlint.config.mjs` extends
   `@commitlint/config-conventional`, so the allowed types are `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`,
   `refactor`, `revert`, `style` and `test`. The header, scope included, is at most 50 characters
1. **Push the branch** and open a PR with `gh pr create`. The PR title becomes the squash commit's header, so it
   follows the commit rules above, 50 characters at most
1. **Merge** the verified head with
   `gh pr merge <number> --squash --delete-branch --match-head-commit <40-character-head-sha>`. Capture `headRefOid`
   from `gh pr view`, verify and review that exact SHA, then put its literal value in the merge command. Agents are
   authorised to merge without per-PR human approval when all of these are true:
   - The PR targets `main`, is not a draft and GitHub reports it mergeable
   - Fresh project verification passes against the PR head
   - There is no unresolved Critical or Important review finding and no known regression

If any condition cannot be verified, leave the PR open and report the blocker. Direct and force pushes to `main` remain
forbidden; autonomous merge authority does not bypass the PR gate. Never use `--admin` or `--auto` to override or defer
the gate. Auto-merge is enabled on the repository, but agents do not use it: `guard-git.sh` blocks `--auto`, so an
agent merges only the head it verified, pinned with `--match-head-commit`.

Within this repository, this rule overrides any generic skill that presents integration as a human-choice menu. Once the
requested work is ready and the gate passes, merge it without asking again unless the user explicitly asks to leave the
PR open or in draft.

Small fixes still go through a branch. The overhead is one command; the alternative is a `main` nobody can review or
revert cleanly.

**TODOs live in GitHub Issues**, not a markdown checklist, a `docs/plan.md`, or a code comment. A checklist in a file
goes stale, conflicts on merge, and is invisible to anyone not in that file. Reference the issue in the PR so merging
closes it: `Closes #12`. A short-lived, in-session task list is fine; anything that outlives the session is not.

```bash
gh issue list                          # what is open
gh issue create -t "..." -b "..."      # add one
gh issue close <n>                     # done
```
