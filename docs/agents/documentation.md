# Documentation hygiene

**[`docs/references/markdown-style.md`](../references/markdown-style.md) is the style guide for every Markdown file in
this repo.** It covers document layout, headings, lists, code blocks, links, images and tables. Read it before
restructuring a document. The rules below are this project's additions to it, not a replacement, and two
amendments to the guide itself are in [Markdown style amendments](project.md#markdown-style-amendments).

- **Sentence case for headings, bold lead-in labels and table headers**, per the style guide. Acronyms and proper names
  keep their form: AI, API, PR, MUBA, Gonka, Kimi, Biome, Devfolio
- **Forward-looking only.** Apply this to what you write or touch. Do not sweep existing docs to conform
- **Never change a quotation.** In [`docs/source/`](../source/) the structure and our own framing follow the style
  guide, but an organizer's words are reproduced exactly. A reworded quote is a wrong quote
- **No clumped prose.** No block over four lines. Three or more consecutive bolded-lead-in paragraphs are a list. An
  enumeration of three or more items inside a sentence is a list
- **A table must earn itself.** Use one for uniform data across two dimensions. A two-column table of labels and prose
  is a list; so is a one-column table
- **Never drop a measured figure, a citation, a section reference or a limitation** to save space. Reformatting must be
  lossless
- **Never create a second file overlapping an existing one.** Update the existing file

## README versus TRD

Both may describe architecture. They differ in **depth and audience**, not subject.

|              | `README.md`                                                      | `docs/TRD.md`                                  |
| ------------ | ---------------------------------------------------------------- | ---------------------------------------------- |
| **Audience** | Judges, external reviewers, anyone landing on the repo           | Developers implementing against it             |
| **Depth**    | High-level narrative: the whats, hows and whys                   | Canonical implementation-level reference       |
| **Contains** | Architecture overview, diagrams, setup, constraints, limitations | API contracts, data models, schemas, rationale |
| **Rule**     | Anything an outside reader needs must live here                  | Never duplicate the README. Go deeper instead  |

"It is in the TRD" is a valid answer for implementation detail, **not** for anything a reviewer needs. **A judge reads
the README.** The track brief asks for "clean code with clear documentation on the GonkaRouter integration", and that is
where they look. It lives at the repo root, where GitHub renders it as the landing page, so keep links relative to the
root. It follows the M1KUAPP org README template, which wins over
[`docs/references/markdown-style.md`](../references/markdown-style.md) for that file.
