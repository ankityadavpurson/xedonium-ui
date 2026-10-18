import type { Theme, ThemeMode } from '../types'
import { DEFAULT_THEME_STORAGE_KEY } from './constants'

export const getSystemTheme = (): Theme => {
	if (typeof window === 'undefined') return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// The saved choice: `light` or `dark`, or `system` (only saved when the default is not `system`). Null if none or invalid.
export const getStoredThemeOverride = (storageKey = DEFAULT_THEME_STORAGE_KEY): ThemeMode | null => {
	if (typeof window === 'undefined') return null

	try {
		const savedTheme = window.localStorage.getItem(storageKey)
		if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') return savedTheme
	} catch {
		// storage blocked: fall back to the system theme
	}

	return null
}
