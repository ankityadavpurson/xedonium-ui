import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

const root = import.meta.dirname

// Served from /xedonium-ui/ on GitHub Pages; plain / in dev. The docs import the library straight from ../src.
export default defineConfig(({ command }) => ({
	root,
	base: command === 'build' ? '/xedonium-ui/' : '/',
	plugins: [react()],
	resolve: {
		alias: {
			'xedonium/styles.css': path.join(root, '../src/styles.css'),
			xedonium: path.join(root, '../src/index.js'),
		},
	},
	build: { outDir: 'dist', emptyOutDir: true },
	server: { port: 3100 },
	preview: { port: 3100 },
}))
