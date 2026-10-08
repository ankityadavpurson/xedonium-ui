// The Playground shows every docs example of a component, live and editable. A section per component, grouped by the
// docs categories: /playground/<category>#<component>.

/** Path of a component's section in the Playground: its category page, scrolled to the component. */
export const playgroundPath = (category, component) => `/playground/${category.slug}#${component.slug}`

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
