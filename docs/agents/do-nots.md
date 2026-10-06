# Critical do-nots

- **Do not** call an AI provider directly. Everything goes through GonkaRouter, with the two documented exemptions in
  `apps/server/transcribe/` and `apps/server/chat/`. Widening either directory, or adding a third, is a track requirement
  decision and not a refactor
- **Do not** import or adapt code written before 26 Aug 2026
- **Do not** commit `.env` or any `sk-…` key. `.env.example` carries key names, never values
- **Do not** commit directly to `main`, force-push, rewrite published history, or delete a branch other than a merged
  feature branch
- **Do not** merge a draft, conflicted, failing or known-breaking PR. Leave it open and report the blocker
- **Do not** track TODOs in a markdown file
- **Do not** hardcode model ids without verifying them against `/v1/models`. They are case- and slash-sensitive
- **Do not** create `docs/architecture.md` or a second README beside the root `README.md`
- **Do not** start implementation before `PRODUCT.md`, `PRD.md` and `TRD.md` all exist
- **Do not** change a quotation in [`docs/source/`](../source/). Corrections go in `docs/BRIEF.md`
- **Do not** commit a path that only exists on your machine. `~/CS/...`, `/home/<you>/...`, `C:\Users\...`,
  `\\wsl.localhost\...` and scratch dirs under `/tmp` are invisible to everyone else. Name the tool, not your copy of
  it. Machine-independent locations like `~/.claude/` are fine
- **Do not** burn GonkaRouter tokens on idle experimentation
- **Do not** miss the Devfolio submission. No submission means no pitching
