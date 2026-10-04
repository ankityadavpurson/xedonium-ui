import { DEFAULT_THEME_STORAGE_KEY } from './constants'

export const getSystemTheme = () => {
	if (typeof window === 'undefined') return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const getStoredThemeOverride = (storageKey = DEFAULT_THEME_STORAGE_KEY) => {
	if (typeof window === 'undefined') return null

	try {
		const savedTheme = window.localStorage.getItem(storageKey)
		if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
	} catch {
		// storage blocked: fall back to the system theme
	}

	return null
}
