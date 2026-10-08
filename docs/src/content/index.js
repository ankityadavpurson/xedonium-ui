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
import { sortByName } from './sortByName'
import typography from './typography'
import utilities from './utilities'

// The categories keep their order; the components inside each one are listed alphabetically (sidebar, category page,
// prev / next links and search all follow this order)
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
].map(category => ({ ...category, components: sortByName(category.components) }))

export const pathOf = (category, component) => `/components/${category.slug}/${component.slug}`

// Flat, ordered list of every component page (drives prev/next links and search)
export const pages = categories.flatMap(category => category.components.map(component => ({ category, component })))

export const findPage = (categorySlug, componentSlug) =>
	pages.find(p => p.category.slug === categorySlug && p.component.slug === componentSlug)
