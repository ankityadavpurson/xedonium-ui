import { createContext, useContext } from 'react'
import type { Theme } from '../types'

export interface ThemeValue {
	activeTheme: Theme
	toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeValue>({ activeTheme: 'dark', toggleTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)
