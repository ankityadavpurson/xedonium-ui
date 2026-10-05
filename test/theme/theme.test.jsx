import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { ThemeContext, useTheme } from '../../src/theme/ThemeContext'
import ThemeProvider from '../../src/theme/ThemeProvider'
import { DEFAULT_THEME_STORAGE_KEY, THEME_FAVICON_COLORS } from '../../src/theme/constants'
import { buildFaviconHref } from '../../src/theme/favicon'
import { getStoredThemeOverride, getSystemTheme } from '../../src/theme/systemTheme'
import useAppTheme from '../../src/theme/useAppTheme'

const mockMedia = dark => {
	const listeners = new Set()
	window.matchMedia = vi.fn(() => ({
		matches: dark,
		addEventListener: (_, fn) => listeners.add(fn),
		removeEventListener: (_, fn) => listeners.delete(fn),
	}))
	return { emit: matches => listeners.forEach(fn => fn({ matches })), listeners }
}

beforeEach(() => {
	window.localStorage.clear()
	document.head.innerHTML = ''
})

describe('systemTheme', () => {
	it('reads the system theme', () => {
		mockMedia(true)
		expect(getSystemTheme()).toBe('dark')
		mockMedia(false)
		expect(getSystemTheme()).toBe('light')
	})
	it('reads a valid stored override only', () => {
		expect(getStoredThemeOverride()).toBeNull()
		window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, 'dark')
		expect(getStoredThemeOverride()).toBe('dark')
		window.localStorage.setItem('k', 'purple')
		expect(getStoredThemeOverride('k')).toBeNull()
	})
	it('tolerates blocked storage', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked')
		})
		expect(getStoredThemeOverride()).toBeNull()
	})
})

describe('buildFaviconHref', () => {
	it('builds a data URI with theme colours and title', () => {
		for (const theme of ['light', 'dark']) {
			const href = buildFaviconHref(theme, 'My App')
			expect(href.startsWith('data:image/svg+xml,')).toBe(true)
			const svg = decodeURIComponent(href.replace('data:image/svg+xml,', ''))
			expect(svg).toContain(THEME_FAVICON_COLORS[theme].outer)
			expect(svg).toContain('My App')
		}
		expect(buildFaviconHref('dark')).toContain('data:')
	})
})

describe('ThemeContext', () => {
	it('has defaults', () => {
		const { result } = renderHook(() => useTheme())
		expect(result.current.activeTheme).toBe('dark')
		expect(() => result.current.toggleTheme()).not.toThrow()
		expect(ThemeContext).toBeDefined()
	})
})

describe('useAppTheme', () => {
	it('follows the system theme and live changes', () => {
		const media = mockMedia(false)
		const { result, unmount } = renderHook(() => useAppTheme({ favicon: false }))
		expect(result.current.activeTheme).toBe('light')
		expect(document.documentElement.dataset.theme).toBe('light')
		act(() => media.emit(true))
		expect(result.current.activeTheme).toBe('dark')
		act(() => media.emit(false))
		expect(result.current.activeTheme).toBe('light')
		unmount()
		expect(media.listeners.size).toBe(0)
	})

	it('toggles, persists, and restores', () => {
		mockMedia(false)
		const { result } = renderHook(() => useAppTheme({ favicon: false, storageKey: 'k' }))
		act(() => result.current.toggleTheme())
		expect(result.current.activeTheme).toBe('dark')
		expect(window.localStorage.getItem('k')).toBe('dark')
		act(() => result.current.toggleTheme())
		expect(result.current.activeTheme).toBe('light')
		const again = renderHook(() => useAppTheme({ favicon: false, storageKey: 'k' }))
		expect(again.result.current.activeTheme).toBe('light')
	})

	it('toggles from a dark system theme to light', () => {
		mockMedia(true)
		const { result } = renderHook(() => useAppTheme({ favicon: false }))
		act(() => result.current.toggleTheme())
		expect(result.current.activeTheme).toBe('light')
	})

	it('survives blocked storage writes', () => {
		mockMedia(false)
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked')
		})
		vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
			throw new Error('blocked')
		})
		const { result } = renderHook(() => useAppTheme({ favicon: false }))
		act(() => result.current.toggleTheme())
		expect(result.current.activeTheme).toBe('dark')
	})

	it('creates and updates the favicon link', () => {
		mockMedia(false)
		const { result } = renderHook(() => useAppTheme({ faviconTitle: 'T' }))
		const link = document.getElementById('app-favicon')
		expect(link).not.toBeNull()
		expect(link.getAttribute('type')).toBe('image/svg+xml')
		const before = link.getAttribute('href')
		act(() => result.current.toggleTheme())
		expect(document.getElementById('app-favicon').getAttribute('href')).not.toBe(before)
	})

	it('reuses an existing icon link', () => {
		mockMedia(false)
		document.head.innerHTML = '<link rel="icon" href="/x.ico">'
		renderHook(() => useAppTheme())
		expect(document.head.querySelectorAll('link')).toHaveLength(1)
		expect(document.head.querySelector('link').getAttribute('href')).toContain('data:image/svg+xml')
	})
})

describe('ThemeProvider', () => {
	it('provides the theme to consumers', () => {
		mockMedia(false)
		const Consumer = () => {
			const { activeTheme, toggleTheme } = useTheme()
			return <button onClick={toggleTheme}>{activeTheme}</button>
		}
		render(
			<ThemeProvider storageKey="p">
				<Consumer />
			</ThemeProvider>
		)
		fireEvent.click(screen.getByRole('button'))
		expect(screen.getByRole('button')).toHaveTextContent('dark')
		expect(document.getElementById('app-favicon')).toBeNull()
	})
})
