// What search engines should know about each docs route. Pure data (no React), shared by the runtime hook (useSeo)
// and the build-time sitemap (../seoPlugin.js).
import { categories, pages, pathOf } from './content'
import { guidePath, guideSections } from './guides/hooks'
import summaryOf from './summaryOf'

export const SITE = 'https://xedonium-ui.web.app'
export const DEFAULT_DESCRIPTION = 'Minimal, theme-aware React + Tailwind UI components.'

// Foundation pages live in foundations/index.js (lazy imports, so not importable here); check-docs keeps this in sync
const STATIC = [
	[
		'/',
		'Minimal, theme-aware React and Tailwind components with no runtime dependencies. Forms, charts, overlays and 160+ icons for light and dark themes.',
		'',
	],
	[
		'/getting-started',
		'Install Xedonium, set up the Tailwind preset and styles, and wrap your app in the ThemeProvider.',
		'Getting started',
	],
	[
		'/foundations/theme',
		'How Xedonium themes work: light, dark and system modes through the data-theme attribute.',
		'Theme',
	],
	['/foundations/colors', 'The semantic app-* color tokens and how to override them.', 'Colors & tokens'],
	['/foundations/typography', 'Type scale and text styles used across Xedonium components.', 'Typography'],
	['/foundations/icons', 'The full icon set, with names to import.', 'Icons'],
	['/changelog', 'What changed in each release of Xedonium.', 'Changelog'],
]

/** Every indexable page: { path, title, description }. The title is empty for the home page. */
export const seoPages = () => [
	...STATIC.map(([path, description, title]) => ({ path, title, description })),
	...categories.map(category => ({
		path: `/components/${category.slug}`,
		title: category.label,
		description: category.description,
	})),
	...pages.map(({ category, component }) => ({
		path: pathOf(category, component),
		title: component.name,
		description: `${component.name}: ${summaryOf(component)}`,
	})),
	...guideSections.flatMap(section => [
		{ path: section.path, title: section.label, description: section.description },
		...section.items.map(entry => ({
			path: guidePath(section, entry),
			title: entry.name,
			description: `${entry.name}: ${entry.summary}`,
		})),
	]),
]

const byPath = new Map(seoPages().map(page => [page.path, page]))

/** The route without a trailing slash (the root stays "/"). */
export const normalizePath = pathname => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname) || '/'

/**
 * { description, canonical, indexable } for a route. Unknown paths (the hosting rewrites every URL to index.html, so
 * they answer 200) and tools like the Playground and full-page previews are not indexable.
 */
export const seoFor = pathname => {
	const path = normalizePath(pathname)
	const page = byPath.get(path)
	if (page) return { description: page.description, canonical: SITE + (path === '/' ? '/' : path), indexable: true }
	return { description: DEFAULT_DESCRIPTION, canonical: null, indexable: false }
}
