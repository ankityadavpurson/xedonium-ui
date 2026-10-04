import { createContext, useContext } from 'react'

export const ThemeContext = createContext({ activeTheme: 'dark', toggleTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)
