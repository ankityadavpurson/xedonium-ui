import fs from 'node:fs'
import path from 'node:path'

const SRC = path.join(import.meta.dirname, '../src')

// name -> { file, named }: where each public export of src/index.ts really lives
const readExportMap = () => {
	const index = fs.readFileSync(
		path.join(
			SRC,
			['index.ts', 'index.js'].find(f => fs.existsSync(path.join(SRC, f)))
		),
		'utf8'
	)
	const map = new Map()
	const resolveFile = specifier => {
		const base = path.join(SRC, specifier)
		const found = ['.tsx', '.ts', '.jsx', '.js', '/index.ts', '/index.js']
			.map(ext => base + ext)
			.find(candidate => fs.existsSync(candidate))
		return found ? path.relative(SRC, found).split(path.sep).join('/') : null
	}
	// export { default as Button } from './components/Button'
	for (const [, name, from] of index.matchAll(/export \{ default as (\w+) \} from '([^']+)'/g)) {
		const file = resolveFile(from)
		if (file) map.set(name, { file, named: false })
	}
	// export { A, B, C } from './theme'   (names exported by a barrel module)
	for (const [, names, from] of index.matchAll(/export \{([^}]+)\} from '([^']+)'/g)) {
		if (/\bdefault as\b/.test(names)) continue
		const file = resolveFile(from)
		if (!file) continue
		for (const name of names
			.split(',')
			.map(part => part.trim())
			.filter(Boolean))
			map.set(name, { file, named: true })
	}
	return map
}

/**
 * Docs only: rewrites the real `import { Button, Select } from 'xedonium'` statements of the docs app into one import
 * per module (`import Button from '@xedonium-src/components/Button.jsx'`), so a page loads just the components it uses,
 * in the dev server as well as in the build, instead of evaluating the whole src/index.ts barrel.
 * It runs after JSX is compiled and finds imports with a real parser, so snippets that merely look like imports inside
 * strings (the code samples in the docs) are left alone, and `?raw` imports are untouched (visitors still read
 * `from 'xedonium'`).
 */
export default function xedoniumImports() {
	let exportMap

	return {
		name: 'xedonium-granular-imports',
		enforce: 'post',
		transform(code, id) {
			if (id.includes('?') || !/\.(jsx?|tsx?)$/.test(id) || !code.includes('xedonium')) return null
			if (!id.replaceAll('\\', '/').includes('/docs/src/')) return null
			exportMap ??= readExportMap()

			const edits = []
			for (const node of this.parse(code).body) {
				if (node.type !== 'ImportDeclaration' || node.source.value !== 'xedonium') continue
				if (!node.specifiers.length || node.specifiers.some(spec => spec.type !== 'ImportSpecifier')) continue
				const lines = []
				const left = []
				for (const spec of node.specifiers) {
					const imported = spec.imported.name ?? spec.imported.value
					const local = spec.local.name
					const entry = exportMap.get(imported)
					if (!entry) left.push(imported === local ? imported : `${imported} as ${local}`)
					else if (entry.named)
						lines.push(
							`import { ${imported === local ? imported : `${imported} as ${local}`} } from '@xedonium-src/${entry.file}'`
						)
					else lines.push(`import ${local} from '@xedonium-src/${entry.file}'`)
				}
				if (!lines.length) continue
				if (left.length) lines.push(`import { ${left.join(', ')} } from 'xedonium'`)
				edits.push({ start: node.start, end: node.end, text: lines.join('\n') })
			}
			if (!edits.length) return null

			let next = code
			for (const { start, end, text } of edits.reverse()) next = next.slice(0, start) + text + next.slice(end)
			return { code: next, map: null }
		},
	}
}
