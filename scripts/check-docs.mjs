// Verifies the docs stay in sync with the library:
//  - every component page has an entry in docs/src/content/props.js, and every documented prop still exists
//  - every example file referenced by a page exists
//  - every component page has at least one example (the Playground shows a page's examples live, one section per component)
// Run with `yarn docs:check`.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.join(import.meta.dirname, '..')
const docs = path.join(root, 'docs/src')
const problems = []

const load = async file => (await import(pathToFileURL(path.join(docs, file)).href)).default

const props = await load('content/props.js')
const exampleTitles = await load('playground/exampleTitles.js')

const categories = []
for (const file of fs
	.readdirSync(path.join(docs, 'content'))
	.filter(f => f.endsWith('.js') && !['index.js', 'props.js', 'propsFor.js', 'sortByName.js'].includes(f))) {
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
		.map(part =>
			part
				.trim()
				.replace(/^\.\.\./, '')
				.split(/[\s=:]/)[0]
				.replace(/^['"]|['"]$/g, '')
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
		if (!component.blocks.some(block => block.example)) {
			problems.push(`${category.slug}/${component.slug}: no example (the Playground section would be empty)`)
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

// Components with several examples name them in playground/exampleTitles.js, one name per example
for (const category of categories) {
	for (const component of category.components) {
		const count = new Set(component.blocks.filter(block => block.example).map(block => block.example)).size
		const names = exampleTitles[`${category.slug}/${component.slug}`]
		if (count > 1 && names?.length !== count)
			problems.push(
				`${category.slug}/${component.slug}: ${count} examples need ${count} names in playground/exampleTitles.js`
			)
		if (count <= 1 && names) problems.push(`${category.slug}/${component.slug}: has names but fewer than two examples`)
	}
}

// seo.js lists the foundation pages itself (foundations/index.js cannot be imported outside Vite)
const foundationPaths = [
	...fs.readFileSync(path.join(docs, 'foundations/index.js'), 'utf8').matchAll(/path: '([^']+)'/g),
]
const seoSource = fs.readFileSync(path.join(docs, 'seo.js'), 'utf8')
for (const [, foundationPath] of foundationPaths) {
	if (!new RegExp(String.raw`\[\s*'${foundationPath}',`).test(seoSource))
		problems.push(`${foundationPath}: missing from the sitemap list in docs/src/seo.js`)
}

// The AI resource catalog (Agentic Resource Discovery, https://github.com/ards-project/ard-spec) must keep matching its schema:
// Lighthouse fails the "Agentic Browsing" audit for a malformed one
const catalogFile = name => fs.readFileSync(path.join(docs, '../public/.well-known', name), 'utf8')
const catalog = JSON.parse(catalogFile('ai-catalog.json'))
// the same catalog is published as ard.json (the name the spec's newer versions use): keep the two identical
const sameLines = text => text.replace(/\r\n/g, '\n')
if (sameLines(catalogFile('ard.json')) !== sameLines(catalogFile('ai-catalog.json')))
	problems.push('ard.json and ai-catalog.json must have the same content')
if (catalog.specVersion !== '1.0') problems.push('ai-catalog.json: specVersion must be "1.0"')
if (!Array.isArray(catalog.entries)) problems.push('ai-catalog.json: entries must be an array')
for (const entry of catalog.entries ?? []) {
	const where = `ai-catalog.json (${entry.identifier ?? 'entry'})`
	if (!/^urn:air:[a-zA-Z0-9.-]+(:[a-zA-Z0-9._-]+)+$/.test(entry.identifier ?? ''))
		problems.push(`${where}: identifier must look like urn:air:<domain>:<namespace>:<name>`)
	if (!entry.displayName || !entry.type) problems.push(`${where}: displayName and type are required`)
	if (Boolean(entry.url) === Boolean(entry.data)) problems.push(`${where}: give exactly one of url or data`)
	if (entry.representativeQueries && (entry.representativeQueries.length < 2 || entry.representativeQueries.length > 5))
		problems.push(`${where}: representativeQueries takes 2 to 5 items`)
}

if (problems.length) {
	console.error(problems.join('\n'))
	process.exit(1)
}
console.log(`docs check ok: ${categories.reduce((n, c) => n + c.components.length, 0)} pages`)
