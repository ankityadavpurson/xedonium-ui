import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: 'src/index.js',
			formats: ['es', 'cjs'],
			fileName: format => `xedonium.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
		copyPublicDir: false,
	},
})
