import preset from '../../../tailwind-preset.js'

// The docs CSS only holds the classes the docs themselves use. In the Playground anything can be typed into a className,
// so Tailwind's browser build is loaded on first use: it watches the page and adds the CSS for every class it finds.
const SRC = 'https://cdn.tailwindcss.com/3.4.17'

let loading = null

export const loadTailwindRuntime = () => {
	if (loading) return loading
	// the library's own theme (app-* colors, dark mode selector); the built stylesheet already has the base styles
	window.tailwind = { config: { ...preset, corePlugins: { preflight: false } } }
	loading = new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = SRC
		script.onload = resolve
		script.onerror = () => {
			loading = null
			reject(new Error('Tailwind runtime failed to load'))
		}
		document.head.appendChild(script)
	})
	return loading
}
