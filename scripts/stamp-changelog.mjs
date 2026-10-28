import fs from 'node:fs'
import path from 'node:path'

// Release step: turns "## [Unreleased]" into "## [X.Y.Z] - date" and opens a fresh empty "## [Unreleased]" above it.
// Usage: node scripts/stamp-changelog.mjs 1.10.0
const version = process.argv[2]
if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) {
	console.error('Usage: node scripts/stamp-changelog.mjs <X.Y.Z>')
	process.exit(1)
}

const file = path.join(import.meta.dirname, '../CHANGELOG.md')
const text = fs.readFileSync(file, 'utf8')
const eol = text.includes('\r\n') ? '\r\n' : '\n'
const heading = /^## \[Unreleased\][ \t]*\r?$/m
if (!heading.test(text)) {
	console.error('CHANGELOG.md has no "## [Unreleased]" heading')
	process.exit(1)
}

const date = new Date().toISOString().slice(0, 10)
fs.writeFileSync(file, text.replace(heading, `## [Unreleased]${eol}${eol}## [${version}] - ${date}`))
console.log(`CHANGELOG.md: Unreleased -> ${version} (${date})`)
