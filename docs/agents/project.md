# Cekgu project instructions

Canonical, tool-agnostic project instructions. Every agentic tool loads `AGENTS.md`, which imports this file and the
other `docs/agents/` topics; `CLAUDE.md` and `GEMINI.md` are symlinks to it.
**Read [`docs/BRIEF.md`](../BRIEF.md) before acting** — deadlines, rules and the judging rubric.

Contents:

1.  [Project](#project)
1.  [Track requirements](#track-requirements)
1.  [Coding guidelines override](#coding-guidelines-override)
1.  [Markdown style amendments](#markdown-style-amendments)
1.  [Specs, plans and research](#specs-plans-and-research)

## Project

**MUBA Blockchain Hackathon 2026**, track **GonkaRouter - AI for Society**. Repo: `github.com/M1KUAPP/Cekgu` (public).

**Submission deadline: 5 Sept 2026, 23:59 MYT**, on Devfolio. No submission means disqualification from pitching. Every
other event fact lives in [`docs/BRIEF.md`](../BRIEF.md), which is the single source of truth for them; organizer
source material is in [`docs/source/`](../source/).

## Track requirements

Non-negotiable, from [`docs/source/gonkarouter-challenge.md`](../source/gonkarouter-challenge.md):

1.  **All AI reasoning and verification runs through GonkaRouter** (`https://api.gonkarouter.io`). Reasoning and
    verification, which is the organizers' own wording — see [`docs/BRIEF.md`](../BRIEF.md). Two directories are
    exempt, and neither may decide anything: `apps/server/transcribe/` turns an uploaded image or PDF into the text
    printed on it ([`docs/TRD.md` section 20](../TRD.md#20-reading-a-paper-from-an-upload)), and `apps/server/chat/`
    phrases the record assistant's answers from facts the Gonka readers already produced
    ([section 21](../TRD.md#21-the-readers-voice-and-the-record-assistant)).
    `apps/server/gateway/only-gonkarouter.test.ts` fails the build if a provider host appears anywhere else, or if
    either directory imports the verdict rule. **`apps/server/retrieval/` is not a third exemption**: it is a search API
    that returns text other people published and calls no model, so the Gonka readers still do every piece of reasoning.
    The same guard holds it to deciding nothing, and asserts its `include_answer: false`
    ([`docs/TRD.md` section 22](../TRD.md#22-live-retrieval-for-cross-verification))
1.  **At least two models cross-verify.** Multi-model consensus
1.  **Gonka Request IDs are surfaced in the UI** for every inference step. This is the on-chain proof: wire it through
    from the first commit, not at the end
1.  **Explicit consensus logic** for model disagreement. The organizers call this "a major plus"

Gateway setup, model ids, client wiring and rate limits: [`docs/TRD.md`](../TRD.md) is canonical, measured against the
live API. [`docs/source/gonkarouter-workshop-slides.md`](../source/gonkarouter-workshop-slides.md) is the organizers'
own account.

## Coding guidelines override

[`andrej-karpathy-skills.md`](andrej-karpathy-skills.md) is imported from the org template. **Where it conflicts with
[How to work](workflow.md#how-to-work), that section wins.** Guideline 1 says to stop and ask when something is unclear.
In this repo, across a ten day build, you do not. Pick the reading that ships, state the assumption, and keep going.
Stop only for the six cases in **Stop and ask only for these**. The rest of guideline 1, surfacing tradeoffs and not
hiding confusion, still applies: say the assumption out loud, just do not wait on an answer.

Strong success criteria let you loop on your own. Weak criteria force check-ins, which is exactly the cost
[Proceed without asking](workflow.md#how-to-work) exists to avoid.

## Markdown style amendments

[`docs/references/markdown-style.md`](../references/markdown-style.md) is the org template's guide, reproduced byte for
byte. Two points where this repository's tooling or house rules override it, recorded here so the exceptions are not
rediscovered from PR descriptions each time.

1.  **Prettier owns list indentation.** Nested list spacing in the guide prescribes a 3-space bullet with a 4-space wrap
    indent, but Prettier rewrites a bullet to one space after the marker and a 2-space continuation indent. The formatter
    wins, per the guide's own advice that the tools always win.
1.  **Sentence case for headings, bold lead-in labels and table headers**, per Capitalization of titles and headers in
    the guide. Product, tool and proper names keep their form. The ones that read like ordinary words, and so get
    lowercased by accident, are the research ledger's concept names: `You Decide`, `Ubat Mak`, `Dua Keping`,
    `Bil Tinggi`, `Tawaran Uni Sah`, `Frozen Friend`, `Model Changelog`, `Bahasa Nenek` and `Hound`.

**Two headings must keep their em dash.** `Receipts — shipped 2026-08-31` and `Network reality — measured, not marketed`
in [`docs/research/gateway-capabilities.md`](../research/gateway-capabilities.md): removing the em dash leaves a doubled
space, and GitHub turns that into the doubled hyphen their anchors carry. Three inbound links depend on it.

## Specs, plans and research

Specs and plans go to [`docs/plans/`](../plans/), and research goes to [`docs/research/`](../research/). A tool that
defaults elsewhere, such as `docs/superpowers/specs/` or `docs/superpowers/plans/`, writes here instead and keeps its
file names. There is no `docs/superpowers/` folder.
