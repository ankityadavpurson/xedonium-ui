import react from '@astrojs/react'
import { defineConfig } from 'astro/config'
import path from 'node:path'
import xedoniumImports from './xedoniumImports.js'

const root = import.meta.dirname

// Served from the site root on Firebase Hosting. The docs import the library straight from ../src, one module per
// component (see xedoniumImports.js), so pages only load what they use.
export default defineConfig({
	root,
	site: 'https://xedonium.web.app',
	// /components/inputs/select -> components/inputs/select.html, which Firebase serves at the clean URL (`cleanUrls` in firebase.json)
	trailingSlash: 'never',
	build: { format: 'file', assets: 'assets' },
	integrations: [react()],
	server: { port: 3100 },
	vite: {
		plugins: [xedoniumImports()],
		resolve: {
			alias: {
				'xedonium/styles.css': path.join(root, '../src/styles.css'),
				xedonium: path.join(root, '../src/index.ts'),
				'@xedonium-src': path.join(root, '../src'),
			},
		},
		// one copy of the router: MemoryRouter and the app's own routes must share its context
		ssr: { noExternal: [/^react-router/] },
	},
})
