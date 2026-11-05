import { StrictMode } from 'react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'xedonium'
import App from './App'

// The whole docs app is one island. Astro renders each route's page to HTML at build time (a MemoryRouter at `url`)
// and the browser hydrates it with the real history; links between docs pages then navigate without a page load.
const DocsRoot = ({ url = '/' }) => {
	const router =
		typeof window === 'undefined' ? (
			<MemoryRouter initialEntries={[url]}>
				<App />
			</MemoryRouter>
		) : (
			<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
				<App />
			</BrowserRouter>
		)
	return (
		<StrictMode>
			<ThemeProvider storageKey="xedonium-docs-theme" favicon allowSystem>
				{router}
			</ThemeProvider>
		</StrictMode>
	)
}

export default DocsRoot
