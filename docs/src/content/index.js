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
import typography from './typography'
import utilities from './utilities'

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
