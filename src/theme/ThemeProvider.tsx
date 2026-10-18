import type { ReactNode } from 'react'
import type { ThemeMode } from '../types'
import { ThemeContext } from './ThemeContext'
import useAppTheme from './useAppTheme'

// Wrap the app once. Sets <html data-theme>, persists the user's override under `storageKey`.
export interface ThemeProviderProps {
	children?: ReactNode
	/** localStorage key that remembers the user's choice. */
	storageKey?: string
	/** Also set the fan favicon for the active theme. */
	favicon?: boolean
	faviconTitle?: string
	/** Offer a third `system` mode that follows the device theme, and make it the default. */
	allowSystem?: boolean
	/** Theme used until the user chooses: `light`, `dark` or `system` (follow the device; the default). */
	defaultTheme?: ThemeMode
}

const ThemeProvider = ({
	children,
	storageKey,
	favicon = false,
	faviconTitle,
	allowSystem,
	defaultTheme,
}: ThemeProviderProps) => {
	const theme = useAppTheme({ storageKey, favicon, faviconTitle, allowSystem, defaultTheme })
	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
