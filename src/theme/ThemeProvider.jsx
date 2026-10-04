import { ThemeContext } from './ThemeContext'
import useAppTheme from './useAppTheme'

// Wrap the app once. Sets <html data-theme>, persists the user's override under `storageKey`.
const ThemeProvider = ({ children, storageKey, favicon = false, faviconTitle }) => {
	const theme = useAppTheme({ storageKey, favicon, faviconTitle })
	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
