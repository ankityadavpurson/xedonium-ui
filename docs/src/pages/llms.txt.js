import { categories, pathOf } from '../content/index.js'
import { DEFAULT_DESCRIPTION, SITE, seoPages } from '../seo.js'

// llms.txt (https://llmstxt.org): an H1, a summary and link lists, in Markdown
const pages = seoPages()
const descriptionOf = path => pages.find(page => page.path === path)?.description ?? ''
const links = items => items.map(([label, path]) => `- [${label}](${SITE}${path}): ${descriptionOf(path)}`).join('\n')

export const GET = () => {
	const sections = categories.map(
		category =>
			`## ${category.label}\n\n${links(category.components.map(component => [component.name, pathOf(category, component)]))}`
	)
	const body = `# Xedonium\n\n> ${DEFAULT_DESCRIPTION}\n\n## Docs\n\n${links([
		['Getting started', '/getting-started'],
		['Theme', '/foundations/theme'],
		['Colors & tokens', '/foundations/colors'],
		['Typography', '/foundations/typography'],
		['Icons', '/foundations/icons'],
		['Changelog', '/changelog'],
	])}\n\n${sections.join('\n\n')}\n`
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
