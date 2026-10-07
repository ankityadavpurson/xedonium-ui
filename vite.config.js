import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// One output file per source module (dist/components/Button.js, .cjs, next to the .d.ts that tsc emits), so apps can
// import a single component (`xedonium/Button`) and bundlers only pull in what is used.
export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			// theme/index is a pure re-export barrel, which Rollup would otherwise drop from the output
			entry: { index: 'src/index.ts', 'theme/index': 'src/theme/index.ts' },
			formats: ['es', 'cjs'],
			fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime'],
			output: { preserveModules: true, preserveModulesRoot: 'src', exports: 'named' },
		},
		copyPublicDir: false,
	},
})
