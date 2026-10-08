import { createContext, useContext } from 'react'
import type { Theme, ThemeMode } from '../types'

export interface ThemeValue {
	/** The theme in effect (the chosen one, or the device theme in `system` mode). */
	activeTheme: Theme
	/** The user's choice. `system` follows the device. */
	themeMode: ThemeMode
	/** Choose a mode; `system` clears the saved override. */
	setThemeMode: (mode: ThemeMode) => void
	/** Whether the `system` mode is offered (`allowSystem`). */
	allowSystem: boolean
	/** Next theme: light <-> dark, or with `allowSystem` system -> light -> dark -> system. */
	toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeValue>({
	activeTheme: 'dark',
	themeMode: 'dark',
	setThemeMode: () => {},
	allowSystem: false,
	toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)
