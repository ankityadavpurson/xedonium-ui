import type { ReactNode } from 'react'
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
}

const ThemeProvider = ({ children, storageKey, favicon = false, faviconTitle }: ThemeProviderProps) => {
	const theme = useAppTheme({ storageKey, favicon, faviconTitle })
	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
