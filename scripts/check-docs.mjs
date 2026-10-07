// Verifies the docs stay in sync with the library:
//  - every component page has an entry in docs/src/content/props.js, and every documented prop still exists
//  - every example file referenced by a page exists
//  - every component page is shown by some Playground section (that is where its "Open in Playground" link goes)
// Run with `yarn docs:check`.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.join(import.meta.dirname, '..')
const docs = path.join(root, 'docs/src')
const problems = []

const load = async file => (await import(pathToFileURL(path.join(docs, file)).href)).default

const props = await load('content/props.js')

const { tabs } = await import(pathToFileURL(path.join(docs, 'playground/registry.js')).href)
const { pickSection } = await import(pathToFileURL(path.join(docs, 'playground/match.js')).href)
const playgroundSections = tabs.flatMap(tab =>
	tab.sections.map(([slug, title]) => {
		const file = path.join(docs, 'playground', tab.key, `${slug}.jsx`)
		if (!fs.existsSync(file)) problems.push(`playground: missing file ${tab.key}/${slug}.jsx`)
		return { tab: tab.key, slug, title, source: fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '' }
	})
)
const categories = []
for (const file of fs
	.readdirSync(path.join(docs, 'content'))
	.filter(f => f.endsWith('.js') && !['index.js', 'props.js', 'propsFor.js'].includes(f))) {
	categories.push(await load(`content/${file}`))
}

// Prop names destructured in a component's first parameter list (best effort)
const sourceProps = name => {
	const file = ['tsx', 'jsx'].map(ext => path.join(root, 'src/components', `${name}.${ext}`)).find(fs.existsSync)
	if (!file) return null
	const text = fs.readFileSync(file, 'utf8')
	const match = text.match(
		new RegExp(String.raw`const ${name} =\s*(?:forwardRef\()?\(\{([\s\S]*?)\}(?::[^)]*)?\)\s*=>`)
	)
	if (!match) return null
	return match[1]
		.split(/,(?![^{[(]*[}\])])/)
		.map(
			part =>
				part
					.trim()
					.replace(/^\.\.\./, '')
					.split(/[\s=:]/)[0]
		)
		.filter(Boolean)
}

for (const category of categories) {
	for (const component of category.components) {
		const groups = props[component.slug]
		if (!groups) {
			problems.push(`${category.slug}/${component.slug}: no props entry`)
			continue
		}
		for (const [name, rows] of Object.entries(groups)) {
			const documented = rows.map(r => r[0].replace(/^\.\.\./, ''))
			const actual = sourceProps(name)
			if (!actual) continue
			for (const prop of actual) {
				if (
					prop !== 'rest' &&
					prop !== 'props' &&
					!documented.includes(prop) &&
					!documented.some(d => d.startsWith('.'))
				) {
					problems.push(`${name}: prop "${prop}" is not documented`)
				}
			}
			for (const prop of documented) {
				if (
					!prop.startsWith('.') &&
					!prop.startsWith('(') &&
					!actual.includes(prop) &&
					!actual.some(a => a === 'rest' || a === 'props')
				) {
					problems.push(`${name}: documented prop "${prop}" does not exist in the source`)
				}
			}
		}
		if (!pickSection(Object.keys(groups), playgroundSections)) {
			problems.push(
				`${category.slug}/${component.slug}: no Playground section uses it (add one in docs/src/playground)`
			)
		}
		for (const block of component.blocks) {
			if (
				block.example &&
				!fs.existsSync(path.join(docs, 'examples', category.slug, `${component.slug}-${block.example}.jsx`))
			) {
				problems.push(`${category.slug}/${component.slug}: missing example ${block.example}`)
			}
		}
	}
}

if (problems.length) {
	console.error(problems.join('\n'))
	process.exit(1)
}
console.log(`docs check ok: ${categories.reduce((n, c) => n + c.components.length, 0)} pages`)
