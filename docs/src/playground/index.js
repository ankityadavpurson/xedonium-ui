// Loads each Playground section's code as raw text: that text is what the visitor sees, edits and runs.
import { pickSection } from './match'
import { tabs } from './registry'

export { tabs }

const sources = import.meta.glob('./*/*.jsx', { query: '?raw', import: 'default', eager: true })

export const sourceOf = (tab, slug) => sources[`./${tab}/${slug}.jsx`]

// Flat list in display order: [{ tab, slug, title, source }]
export const sections = tabs.flatMap(({ key, sections: list }) =>
	list.map(([slug, title]) => ({ tab: key, slug, title, source: sourceOf(key, slug) }))
)

// The Playground section that shows these components (names as in the props tables), if any
export const sectionFor = names => pickSection(names, sections)

export const playgroundPath = ({ tab, slug }) => `/playground?tab=${tab}&section=${slug}`
