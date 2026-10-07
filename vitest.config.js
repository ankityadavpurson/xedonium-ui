import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'happy-dom',
		globals: true,
		// Node 25 warns once per worker that --localstorage-file has no path (happy-dom supplies its own localStorage)
		poolOptions: { forks: { execArgv: ['--no-warnings'] } },
		setupFiles: ['./test/setup.js'],
		include: ['test/**/*.test.{js,jsx}'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{js,jsx,ts,tsx}'],
			exclude: ['src/index.{js,ts}', 'src/types.ts', 'src/**/*.d.ts'],
			reporter: ['text-summary', 'text', 'html'],
			// The suite must stay above 90% — `yarn test:coverage` fails the build otherwise
			thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
		},
	},
})
