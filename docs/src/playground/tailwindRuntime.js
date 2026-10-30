import preset from '../../../tailwind-preset.js'

// The docs CSS only holds the classes the docs themselves use. In the Playground anything can be typed into a className,
// so Tailwind's browser build is loaded on first use: it watches the page and adds the CSS for every class it finds.
const SRC = 'https://cdn.tailwindcss.com/3.4.17'

let loading = null

export const loadTailwindRuntime = () => {
	if (loading) return loading
	loading = new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = SRC
		script.onload = () => {
			// The script creates `window.tailwind` itself and only reads the config assigned to it afterwards. It gets the
			// library's own theme (the app-* colors and the data-theme dark mode, without which `dark:` would follow the
			// OS instead of the theme toggle); the built stylesheet already has the base styles, so preflight is off.
			window.tailwind.config = { ...preset, corePlugins: { preflight: false } }
			resolve()
		}
		script.onerror = () => {
			loading = null
			reject(new Error('Tailwind runtime failed to load'))
		}
		document.head.appendChild(script)
	})
	return loading
}
