#!/usr/bin/env node
/**
 * Exports the README architecture diagram in Cekgu's colours.
 *
 * archify (https://github.com/tt-a1i/archify) renders architecture.json into a standalone HTML viewer. This script
 * delivers that viewer from a temporary copy of the source, restyles it with the light and dark tokens from
 * apps/client/styles.css and the UI font stack, saves the viewer's own SVG export, and pins one copy to each theme.
 *
 * The viewer's SVG export copies every page rule whose selector starts with `svg`, `:root` or `[data-theme`, and
 * resolves each theme's variables from them, so the overrides below reach the file. archify requires `meta.output`,
 * so it is added to the temporary copy only, and the committed source stays without it.
 *
 * Inputs:
 *   - docs/readme/architecture.json, the archify source
 *   - an archify checkout (v2.17) with its dependencies installed (`npm ci` inside it)
 *   - the repository's Playwright (`bun install`), driving Playwright's Chromium (`bunx playwright install
 *     chromium`, once), or installed Google Chrome with CHROME_CHANNEL=chrome
 *
 * Re-run, from the repository root:
 *   node docs/readme/export-architecture.mjs <path-to-archify-checkout>
 *
 * Writes: architecture-light.svg and architecture-dark.svg beside this file.
 */

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const README_DIR = path.dirname(fileURLToPath(import.meta.url))
const SOURCE = path.join(README_DIR, 'architecture.json')

// apps/client/styles.css tokens mapped onto archify's theme variables: paper is the ground, sheet the raised surface,
// well the recessed one, pen the accent, and the verdict colours tint the component kinds.
const THEMES = {
  light: {
    '--bg': '#edeff1', // paper
    '--grid': '#e3e6ea', // well
    '--canvas-dot': '#d7dbe0', // rule
    '--text': '#14181f', // ink
    '--text-muted': '#4d5560', // ink-muted
    '--text-dim': '#6b7480', // rule-strong
    '--text-faint': '#4d5560', // ink-muted
    '--panel': '#ffffff', // sheet
    '--panel-border': '#d7dbe0', // rule
    '--lane-fill': '#e3e6ea', // well
    '--lane-stroke': '#6b7480', // rule-strong
    '--arrow': '#6b7480', // rule-strong
    '--arrow-emphasis': '#b3202f', // pen
    '--mask': '#edeff1', // paper
    '--frontend-fill': 'rgba(36, 86, 166, 0.08)', // verdict-split, tinted
    '--frontend-stroke': '#2456a6', // verdict-split
    '--backend-fill': '#ffffff', // sheet
    '--backend-stroke': '#14181f', // ink
    '--database-fill': 'rgba(107, 79, 187, 0.08)', // verdict-ambiguity, tinted
    '--database-stroke': '#6b4fbb', // verdict-ambiguity
    '--cloud-fill': 'rgba(179, 32, 47, 0.08)', // pen, tinted
    '--cloud-stroke': '#b3202f', // pen
    '--security-fill': 'rgba(179, 32, 47, 0.08)', // pen, tinted
    '--security-stroke': '#b3202f', // pen
    '--messagebus-fill': 'rgba(163, 74, 8, 0.08)', // verdict-key-error, tinted
    '--messagebus-stroke': '#a34a08', // verdict-key-error
    '--external-fill': '#e3e6ea', // well
    '--external-stroke': '#5b6470' // verdict-unverified
  },
  dark: {
    '--bg': '#12161c',
    '--grid': '#222a35',
    '--canvas-dot': '#323b47',
    '--text': '#eceae4',
    '--text-muted': '#a6afba',
    '--text-dim': '#6b7682',
    '--text-faint': '#a6afba',
    '--panel': '#1a2029',
    '--panel-border': '#323b47',
    '--lane-fill': '#222a35',
    '--lane-stroke': '#6b7682',
    '--arrow': '#6b7682',
    '--arrow-emphasis': '#f07079',
    '--mask': '#12161c',
    '--frontend-fill': 'rgba(143, 184, 247, 0.12)',
    '--frontend-stroke': '#8fb8f7',
    '--backend-fill': '#1a2029',
    '--backend-stroke': '#eceae4',
    '--database-fill': 'rgba(185, 166, 242, 0.12)',
    '--database-stroke': '#b9a6f2',
    '--cloud-fill': 'rgba(240, 112, 121, 0.12)',
    '--cloud-stroke': '#f07079',
    '--security-fill': 'rgba(240, 112, 121, 0.12)',
    '--security-stroke': '#f07079',
    '--messagebus-fill': 'rgba(242, 164, 104, 0.12)',
    '--messagebus-stroke': '#f2a468',
    '--external-fill': '#222a35',
    '--external-stroke': '#a0aab6'
  }
}

// The viewer's export leaves trailing spaces in its stylesheet and no final newline. Both break the repository's
// .editorconfig, which editorconfig-checker enforces in `bun run lint`.
const tidy = (text) => `${text.replace(/[ \t]+$/gm, '').replace(/\n+$/, '')}\n`

const declarations = (vars) =>
  Object.entries(vars)
    .map(([name, value]) => `${name}: ${value};`)
    .join(' ')

const tokenCss = [
  `:root, [data-theme="dark"] { ${declarations(THEMES.dark)} }`,
  `[data-theme="light"] { ${declarations(THEMES.light)} }`,
  // Schibsted Grotesk is not embedded: GitHub renders the Helvetica or Arial fallback, as the brand SVGs expect.
  'svg, svg text { font-family: "Schibsted Grotesk", "Helvetica Neue", Arial, sans-serif; }',
  'svg .c-region { fill: var(--lane-fill); fill-opacity: 0.55; stroke: var(--lane-stroke); }',
  'svg text[data-boundary-label] { fill: var(--text-muted); }',
  'svg .a-dashed { stroke: var(--external-stroke); }',
  'svg .m-dashed, svg .t-edge-dashed { fill: var(--external-stroke); }'
].join('\n')

const archifyDir = process.argv[2]
if (!archifyDir) {
  console.error('Usage: node docs/readme/export-architecture.mjs <path-to-archify-checkout>')
  process.exit(2)
}
const archifyBin = path.resolve(archifyDir, 'bin/archify.mjs')
if (!fs.existsSync(archifyBin)) throw new Error(`No archify CLI at ${archifyBin}`)

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cekgu-architecture-'))
try {
  const source = JSON.parse(fs.readFileSync(SOURCE, 'utf8'))
  if (source.meta.output) throw new Error('architecture.json must not carry meta.output; it is added to a copy here')
  source.meta.output = 'architecture.html'
  const input = path.join(workDir, 'architecture.json')
  const viewer = path.join(workDir, 'architecture.html')
  fs.writeFileSync(input, `${JSON.stringify(source, null, 2)}\n`)

  const deliver = spawnSync(
    process.execPath,
    [archifyBin, 'deliver', 'architecture', input, viewer, '--quality', 'showcase', '--json'],
    { encoding: 'utf8' }
  )
  if (deliver.status !== 0) throw new Error(`archify deliver failed:\n${deliver.stdout}${deliver.stderr}`)
  const { validation } = JSON.parse(deliver.stdout)
  console.log(
    `archify deliver: ${validation.checksPassed}/${validation.checkCount} checks, ${validation.errors} errors`
  )

  const html = fs.readFileSync(viewer, 'utf8')
  if (!html.includes('</head>')) throw new Error('No </head>: is this an archify HTML file?')
  const styled = path.join(workDir, 'styled.html')
  fs.writeFileSync(styled, html.replace('</head>', `<style id="cekgu-tokens">\n${tokenCss}\n</style>\n</head>`))

  const channel = process.env.CHROME_CHANNEL
  const browser = await chromium.launch(channel ? { channel } : {})
  try {
    const page = await browser.newPage({ acceptDownloads: true, viewport: { width: 1440, height: 900 } })
    await page.goto(pathToFileURL(styled).href)
    await page.evaluate(() => document.fonts.ready)
    await page.click('#btn-export')
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#export-menu [data-format="svg"]')
    ])
    const svg = fs.readFileSync(await download.path(), 'utf8')
    if (!/^<\?xml[^>]*>\s*<svg /.test(svg)) throw new Error('The export is not an SVG document')

    // The export carries both themes and follows prefers-color-scheme. Each README file is pinned to one theme, so
    // the <picture> element, not the image, decides which one a reader sees.
    for (const scheme of ['light', 'dark']) {
      const outFile = path.join(README_DIR, `architecture-${scheme}.svg`)
      fs.writeFileSync(outFile, tidy(svg.replace(/<svg /, `<svg data-theme="${scheme}" `)))
      console.log(`wrote ${path.relative(process.cwd(), outFile)}`)
    }
  } finally {
    await browser.close()
  }
} finally {
  fs.rmSync(workDir, { recursive: true, force: true })
}
