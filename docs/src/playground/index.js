import { pathOf } from '../content'
import exampleTitles from './exampleTitles'

// The Playground shows every docs example of a component, live and editable. Each component has its own page under its
// docs URL (/components/<category>/<component>/playground); /playground/<category> lists a whole category.

/** Path of a component's Playground page: its docs URL plus /playground. */
export const playgroundPath = (category, component) => `${pathOf(category, component)}/playground`

// The ten components the Playground landing page starts with: [category slug, component slug]
export const BASICS = [
	['inputs', 'button'],
	['inputs', 'field'],
	['inputs', 'select'],
	['inputs', 'checkbox'],
	['inputs', 'switch'],
	['data-display', 'card'],
	['feedback', 'alert'],
	['navigation', 'tabs'],
	['overlay', 'dialog'],
	['overlay', 'toast'],
]

/** Example numbers a component's docs page shows, in order, without repeats. */
export const exampleNumbers = component => [
	...new Set(component.blocks.filter(block => block.example).map(block => block.example)),
]

/** Names of a component's examples for the Playground toggle (empty: "Example 1", "Example 2"...). */
export const exampleNames = (category, component) => exampleTitles[`${category.slug}/${component.slug}`] ?? []
