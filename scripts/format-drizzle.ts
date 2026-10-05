// Runs after `drizzle-kit generate`, which writes tab-indented SQL and snapshots with no final
// newline. Rewrites its output to the repository's .editorconfig: each leading tab becomes two
// spaces and every file ends in exactly one newline.
//
// Rewriting an applied migration is safe. The migrator stores a hash of each file but decides what
// to run by comparing the journal's `when` with the last applied `created_at`, never the hash.

import { Glob } from 'bun'

let changed = 0

for await (const path of new Glob('drizzle/**/*.{sql,json}').scan('.')) {
  const text = await Bun.file(path).text()
  const fixed = text.replace(/^\t+/gm, (tabs) => '  '.repeat(tabs.length)).replace(/\n*$/, '\n')

  if (fixed !== text) {
    await Bun.write(path, fixed)
    changed += 1
  }
}

console.log(`format-drizzle: ${changed} file(s) rewritten`)
