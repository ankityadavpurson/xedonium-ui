import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'xedonium'
import App from './App'
import './main.css'
import { clearChunkReloadGuard, reloadOnStaleChunk } from './reloadOnStaleChunk'

// A route chunk from an older deploy is gone: reload once to get the current build
window.addEventListener('vite:preloadError', event => {
	if (reloadOnStaleChunk(event.payload ?? 'Failed to fetch dynamically imported module')) event.preventDefault()
})
window.addEventListener('load', () => setTimeout(clearChunkReloadGuard, 5000))

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider storageKey="xedonium-docs-theme" favicon>
			<BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
				<App />
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
)
