import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import type { Theme, ThemeMode } from '../types'
import { DEFAULT_THEME_STORAGE_KEY } from './constants'
import { buildFaviconHref } from './favicon'
import { getStoredThemeOverride, getSystemTheme } from './systemTheme'

// Tracks the OS theme plus a user override (persisted), mirrors the result to <html data-theme>,
// and, when `favicon` is true, sets the fan favicon for the active theme (adding the <link rel="icon"> if missing).
export interface UseAppThemeOptions {
	storageKey?: string
	favicon?: boolean
	faviconTitle?: string
	/**
	 * Offer a `system` mode that follows the device theme, and make it the default. `toggleTheme` then cycles
	 * system -> light -> dark -> system. Without it, the device theme is followed until the user toggles (the default).
	 */
	allowSystem?: boolean
}

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } }

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const useAppTheme = ({
	storageKey = DEFAULT_THEME_STORAGE_KEY,
	favicon = true,
	faviconTitle = '',
	allowSystem = false,
}: UseAppThemeOptions = {}) => {
	const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme)
	const [themeOverride, setThemeOverride] = useState<Theme | null>(() => getStoredThemeOverride(storageKey))
	const activeTheme = themeOverride || systemTheme
	const themeMode: ThemeMode = themeOverride ?? 'system'

	useEffect(() => {
		if (typeof window === 'undefined') return undefined

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleThemeChange = (event: MediaQueryListEvent) => setSystemTheme(event.matches ? 'dark' : 'light')

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
		let link = (document.getElementById('app-favicon') ??
			document.querySelector("link[rel~='icon']")) as HTMLLinkElement | null
		if (!link) {
			link = document.createElement('link')
			link.id = 'app-favicon'
			link.rel = 'icon'
			document.head.appendChild(link)
		}
		link.setAttribute('type', 'image/svg+xml')
		link.setAttribute('href', buildFaviconHref(activeTheme, faviconTitle))
	}, [activeTheme, favicon, faviconTitle])

	// Crossfades the whole page with the View Transitions API (the colour transitions are paused meanwhile so the
	// new snapshot is not captured half-faded). Browsers without it, and users who prefer reduced motion, just
	// get the per-element colour transitions from styles.css.
	const setThemeMode = (mode: ThemeMode) => {
		const override = mode === 'system' ? null : mode
		const next: Theme = override ?? systemTheme
		const root = document.documentElement
		const doc = document as ViewTransitionDocument
		if (next === activeTheme || !doc.startViewTransition || prefersReducedMotion()) {
			setThemeOverride(override)
			return
		}
		root.setAttribute('data-theme-switching', '')
		const transition = doc.startViewTransition(() =>
			flushSync(() => {
				root.setAttribute('data-theme', next)
				setThemeOverride(override)
			})
		)
		const done = () => root.removeAttribute('data-theme-switching')
		transition.finished.then(done, done)
	}

	const toggleTheme = () => {
		if (!allowSystem) return setThemeMode(activeTheme === 'dark' ? 'light' : 'dark')
		setThemeMode(themeMode === 'system' ? 'light' : themeMode === 'light' ? 'dark' : 'system')
	}

	return { activeTheme, themeMode, setThemeMode, allowSystem, toggleTheme }
}

export default useAppTheme
