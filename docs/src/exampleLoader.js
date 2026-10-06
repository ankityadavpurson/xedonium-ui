import { lazy } from 'react'

// Every docs example (the demo component and its source text) is its own chunk, loaded only when its page shows it.
// Keys are paths relative to docs/src, e.g. "./examples/inputs/select-1.jsx".
const demoLoaders = import.meta.glob('./examples/**/*.jsx')
const sourceLoaders = import.meta.glob('./examples/**/*.jsx', { query: '?raw', import: 'default' })

/** Key of a component page's example: category folder, page slug and the example number. */
export const exampleKey = (category, component, n) => `./examples/${category.slug}/${component.slug}-${n}.jsx`

const demos = new Map()

/** The demo component for a key (a stable React.lazy component), or null when there is no such example. */
export const lazyDemo = key => {
	if (!demoLoaders[key]) return null
	if (!demos.has(key)) demos.set(key, lazy(demoLoaders[key]))
	return demos.get(key)
}

/** Promise of the example's source text, or null when there is no such example. */
export const loadSource = key => sourceLoaders[key]?.() ?? null
