import { categories, pathOf } from './src/content/index.js'
import { DEFAULT_DESCRIPTION, SITE, seoPages } from './src/seo.js'

const url = path => `${SITE}${path === '/' ? '/' : path}`

// llms.txt (https://llmstxt.org): an H1, a summary and link lists, in Markdown
const llmsTxt = () => {
	const pages = seoPages()
	const descriptionOf = path => pages.find(page => page.path === path)?.description ?? ''
	const links = items => items.map(([label, path]) => `- [${label}](${url(path)}): ${descriptionOf(path)}`).join('\n')
	const sections = categories.map(
		category =>
			`## ${category.label}\n\n${links(category.components.map(component => [component.name, pathOf(category, component)]))}`
	)
	return `# Xedonium\n\n> ${DEFAULT_DESCRIPTION}\n\n## Docs\n\n${links([
		['Getting started', '/getting-started'],
		['Theme', '/foundations/theme'],
		['Colors & tokens', '/foundations/colors'],
		['Typography', '/foundations/typography'],
		['Icons', '/foundations/icons'],
		['Changelog', '/changelog'],
	])}\n\n${sections.join('\n\n')}\n`
}

// Writes sitemap.xml and llms.txt next to index.html in the build output (robots.txt in public/ points to the sitemap)
export default () => {
	let server = false
	return {
		name: 'xedonium-seo',
		apply: 'build',
		config: (_, { isSsrBuild }) => {
			server = Boolean(isSsrBuild)
		},
		generateBundle() {
			if (server) return // only the browser build carries the sitemap
			const urls = seoPages()
				.map(({ path }) => `\t<url><loc>${url(path)}</loc></url>`)
				.join('\n')
			this.emitFile({
				type: 'asset',
				fileName: 'sitemap.xml',
				source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
			})
			this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() })
		},
	}
}
