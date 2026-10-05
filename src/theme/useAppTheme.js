import { useEffect, useState } from 'react'
import { DEFAULT_THEME_STORAGE_KEY } from './constants'
import { buildFaviconHref } from './favicon'
import { getStoredThemeOverride, getSystemTheme } from './systemTheme'

// Tracks the OS theme plus a user override (persisted), mirrors the result to <html data-theme>,
// and, when `favicon` is true, sets the fan favicon for the active theme (adding the <link rel="icon"> if missing).
const useAppTheme = ({ storageKey = DEFAULT_THEME_STORAGE_KEY, favicon = true, faviconTitle = '' } = {}) => {
	const [systemTheme, setSystemTheme] = useState(getSystemTheme)
	const [themeOverride, setThemeOverride] = useState(() => getStoredThemeOverride(storageKey))
	const activeTheme = themeOverride || systemTheme

	useEffect(() => {
		if (typeof window === 'undefined') return undefined

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleThemeChange = event => setSystemTheme(event.matches ? 'dark' : 'light')

		mediaQuery.addEventListener('change', handleThemeChange)
		return () => mediaQuery.removeEventListener('change', handleThemeChange)
	}, [])

	useEffect(() => {
		try {
			if (themeOverride) window.localStorage.setItem(storageKey, themeOverride)
			else window.localStorage.removeItem(storageKey)
		} catch {
			// storage blocked: theme still works for this session
		}
	}, [themeOverride, storageKey])

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', activeTheme)
		if (!favicon) return

		// Create the <link> when the page has none, so the fan icon works without any index.html setup
		let link = document.getElementById('app-favicon') || document.querySelector("link[rel~='icon']")
		if (!link) {
			link = document.createElement('link')
			link.id = 'app-favicon'
			link.rel = 'icon'
			document.head.appendChild(link)
		}
		link.setAttribute('type', 'image/svg+xml')
		link.setAttribute('href', buildFaviconHref(activeTheme, faviconTitle))
	}, [activeTheme, favicon, faviconTitle])

	const toggleTheme = () => setThemeOverride(current => ((current || systemTheme) === 'dark' ? 'light' : 'dark'))

	return { activeTheme, toggleTheme }
}

export default useAppTheme
