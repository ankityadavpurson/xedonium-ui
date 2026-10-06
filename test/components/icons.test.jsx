import { render } from '@testing-library/react'
import * as api from '../../src/index'

const icons = Object.entries(api).filter(([name]) => name.endsWith('Icon'))

describe('icons', () => {
	it('exports every icon', () => {
		expect(icons.length).toBe(15)
	})

	it.each(icons)('%s renders a decorative svg with default and custom classes', (_, Icon) => {
		const { container, rerender } = render(<Icon />)
		const svg = container.querySelector('svg')
		expect(svg).toHaveAttribute('aria-hidden', 'true')
		expect(svg.getAttribute('class')).toBeTruthy()
		rerender(<Icon className="h-8 w-8" />)
		expect(container.querySelector('svg')).toHaveClass('h-8', 'w-8')
	})
})

describe('SortIcon', () => {
	it('dims the chevron that is not active', () => {
		const { container, rerender } = render(<api.SortIcon />)
		const dimmed = () => [...container.querySelectorAll('path')].map(p => p.classList.contains('opacity-35'))
		expect(dimmed()).toEqual([true, true])
		rerender(<api.SortIcon direction="asc" />)
		expect(dimmed()).toEqual([false, true])
		rerender(<api.SortIcon direction="desc" />)
		expect(dimmed()).toEqual([true, false])
	})
})

describe('public API', () => {
	it('exports components, hooks and theme helpers', () => {
		for (const name of [
			'Button',
			'Modal',
			'Select',
			'DataGrid',
			'ThemeProvider',
			'useAppTheme',
			'useTheme',
			'useDismissable',
			'useKeyboardShortcuts',
			'buildFaviconHref',
			'toolbarButtonClass',
		]) {
			expect(api[name], name).toBeDefined()
		}
		expect(api.DEFAULT_THEME_STORAGE_KEY).toBe('xedonium-theme-override')
		expect(api.THEME_FAVICON_COLORS.dark).toBeDefined()
	})
})
