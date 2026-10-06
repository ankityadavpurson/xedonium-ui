// Verifies the built package: every `exports` target exists in dist/ (patterns checked against the real files), every
// module has its ESM, CommonJS and type files, and the documented import paths resolve in both module systems.
// Run after `yarn build` (it is part of `prepublishOnly`).
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const root = path.join(import.meta.dirname, '..')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const problems = []
const require = createRequire(path.join(root, 'noop.js'))

const exists = relative => fs.existsSync(path.join(root, relative))
const list = directory =>
	fs.existsSync(path.join(root, directory))
		? fs.readdirSync(path.join(root, directory), { withFileTypes: true }).filter(entry => entry.isFile())
		: []

for (const [key, value] of Object.entries(pkg.exports)) {
	const targets = typeof value === 'string' ? { default: value } : value
	for (const [condition, target] of Object.entries(targets)) {
		if (!target.includes('*')) {
			if (!exists(target)) problems.push(`${key} [${condition}]: ${target} is missing`)
			continue
		}
		// pattern: at least one module must match, and each match needs the other formats too
		const directory = path.posix.dirname(target)
		const [prefix, suffix] = path.posix.basename(target).split('*')
		const matches = list(directory).filter(file => file.name.startsWith(prefix) && file.name.endsWith(suffix))
		if (!matches.length) problems.push(`${key} [${condition}]: nothing in ${directory} matches ${target}`)
		for (const file of matches) {
			const name = file.name.slice(prefix.length, file.name.length - suffix.length)
			for (const other of Object.values(targets)) {
				const sibling = other.replace('*', name)
				if (!exists(sibling)) problems.push(`${key}: ${sibling} is missing (module "${name}")`)
			}
		}
	}
}

// Documented import paths: [specifier, a named export that must exist, 'default' when it is the default export]
const expectations = [
	['xedonium', 'Button'],
	['xedonium', 'useTimedToast'],
	['xedonium', 'ThemeProvider'],
	['xedonium/Button', 'default'],
	['xedonium/Select', 'default'],
	['xedonium/hooks/useTimedToast', 'default'],
	['xedonium/icons/Check', 'default'],
	['xedonium/theme', 'ThemeProvider'],
	['xedonium/theme', 'useTheme'],
]
for (const [specifier, name] of expectations) {
	try {
		const esm = await import(specifier)
		if (typeof esm[name] === 'undefined') problems.push(`import('${specifier}') has no "${name}"`)
		const cjs = require(specifier)
		if (typeof cjs[name] === 'undefined') problems.push(`require('${specifier}') has no "${name}"`)
	} catch (error) {
		problems.push(`${specifier} failed to load: ${error.message.split('\n')[0]}`)
	}
}

if (problems.length) {
	console.error(problems.join('\n'))
	process.exit(1)
}
console.log(`exports check ok: ${Object.keys(pkg.exports).length} entries, ${expectations.length} import paths`)
