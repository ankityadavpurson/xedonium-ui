import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'xedonium'
import App from './App'
import './main.css'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider storageKey="xedonium-docs-theme" favicon>
			<BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
				<App />
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
)
