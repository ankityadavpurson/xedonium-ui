import path from 'node:path'
import preset from '../tailwind-preset.js'

const root = import.meta.dirname

export default {
	presets: [preset],
	content: [`${root}/src/**/*.{js,jsx}`, `${root}/docs/**/*.mdx`, path.join(root, '../src/**/*.{js,jsx}')],
	// Infima ships its own reset; Docusaurus sets <html data-theme="light|dark">, same as the library
	corePlugins: { preflight: false },
}
