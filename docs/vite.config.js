import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import xedoniumImports from './xedoniumImports.js'

const root = import.meta.dirname

// React and the router change rarely: keep them in one long-cacheable chunk apart from the app code.
const VENDOR = /node_modules[\\/](react|react-dom|react-router|react-router-dom|@remix-run|scheduler)[\\/]/

// Served from /xedonium-ui/ on GitHub Pages; plain / in dev. The docs import the library straight from ../src,
// one module per component (see xedoniumImports.js), so pages only load what they use.
export default defineConfig(({ command }) => ({
	root,
	base: command === 'build' ? '/xedonium-ui/' : '/',
	plugins: [xedoniumImports(), react()],
	resolve: {
		alias: {
			'xedonium/styles.css': path.join(root, '../src/styles.css'),
			xedonium: path.join(root, '../src/index.ts'),
			'@xedonium-src': path.join(root, '../src'),
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		rollupOptions: { output: { manualChunks: id => (VENDOR.test(id) ? 'vendor' : undefined) } },
	},
	server: { port: 3100 },
	preview: { port: 3100 },
}))
