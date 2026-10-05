import application from './application'
import charts from './charts'
import dataDisplay from './data-display'
import dateTime from './date-time'
import feedback from './feedback'
import inputs from './inputs'
import layout from './layout'
import media from './media'
import navigation from './navigation'
import overlay from './overlay'
import props from './props'
import typography from './typography'
import utilities from './utilities'

// Demo components and their source text, keyed by path, e.g. "../examples/inputs/select-1.jsx"
const demos = import.meta.glob('../examples/**/*.jsx', { eager: true })
const sources = import.meta.glob('../examples/**/*.jsx', { query: '?raw', import: 'default', eager: true })

export const categories = [
	layout,
	typography,
	inputs,
	navigation,
	feedback,
	overlay,
	dataDisplay,
	charts,
	dateTime,
	media,
	application,
	utilities,
]

export const pathOf = (category, component) => `/components/${category.slug}/${component.slug}`

// Flat, ordered list of every component page (drives prev/next links and search)
export const pages = categories.flatMap(category => category.components.map(component => ({ category, component })))

export const findPage = (categorySlug, componentSlug) =>
	pages.find(p => p.category.slug === categorySlug && p.component.slug === componentSlug)

export const exampleFor = (category, component, n) => {
	const key = `../examples/${category.slug}/${component.slug}-${n}.jsx`
	return { Demo: demos[key]?.default, source: sources[key] }
}

export const propsFor = component => props[component.slug]
