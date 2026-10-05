// Preloaded by bunfig.toml: env.ts snapshots process.env on first import, and bun test runs every
// file in one process. Unconditional, because Bun also loads a developer's real .env; database
// suites opt in with TEST_DATABASE_URL.
process.env.DATABASE_URL = 'postgres://cekgu@localhost:5432/cekgu'
process.env.BETTER_AUTH_SECRET = 'placeholder'
process.env.GUEST_EMAIL = 'guest@example.invalid'
process.env.GUEST_PASSWORD = 'placeholder'
process.env.MASCOT_ENABLED = 'true'
// Required by env.ts at import; the tests stub fetch, so it is never sent.
process.env.GONKA_API_KEY = 'sk-placeholder-not-a-key'
