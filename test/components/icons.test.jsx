import { render } from '@testing-library/react'
import { createElement } from 'react'
import * as api from '../../src/index'

const icons = Object.entries(api).filter(([name]) => name.endsWith('Icon'))

// Every name in icon-info.md (the requested inventory plus the recommended additions)
const INVENTORY = [
	'plus',
	'minus',
	'x',
	'check',
	'check-circle',
	'arrow-left',
	'arrow-right',
	'arrow-up',
	'arrow-down',
	'chevron-left',
	'chevron-right',
	'chevron-up',
	'chevron-down',
	'edit',
	'pencil',
	'trash-2',
	'copy',
	'clipboard',
	'save',
	'download',
	'upload',
	'refresh-cw',
	'rotate-ccw',
	'rotate-cw',
	'undo-2',
	'redo-2',
	'menu',
	'home',
	'search',
	'filter',
	'sliders-horizontal',
	'more-horizontal',
	'more-vertical',
	'external-link',
	'link',
	'unlink',
	'log-in',
	'log-out',
	'maximize',
	'minimize',
	'file',
	'file-text',
	'file-plus',
	'file-minus',
	'file-edit',
	'file-check',
	'folder',
	'folder-open',
	'folder-plus',
	'folder-minus',
	'user',
	'users',
	'user-plus',
	'user-minus',
	'user-check',
	'user-x',
	'user-cog',
	'contact',
	'circle-user',
	'shield',
	'settings',
	'wrench',
	'cog',
	'sliders',
	'lock',
	'unlock',
	'key',
	'eye',
	'eye-off',
	'power',
	'monitor',
	'smartphone',
	'moon',
	'sun',
	'bell',
	'bell-off',
	'mail',
	'message-circle',
	'message-square',
	'send',
	'at-sign',
	'phone',
	'globe',
	'info',
	'info-circle',
	'help-circle',
	'circle-help',
	'alert-triangle',
	'alert-circle',
	'x-circle',
	'heart',
	'star',
	'bookmark',
	'calendar',
	'clock',
	'map-pin',
	'image',
	'camera',
	'printer',
	'qr-code',
	'archive',
	'archive-restore',
	'box',
	'database',
	'server',
	'cloud',
	'cloud-upload',
	'cloud-download',
	'wifi',
	'wifi-off',
	'zap',
	'activity',
	'bar-chart',
	'pie-chart',
	'trending-up',
	'trending-down',
	'code',
	'terminal',
	'github',
	'git-branch',
	'git-merge',
	'rocket',
	'package',
	'shopping-cart',
	'credit-card',
	'wallet',
	'key-round',
	'fingerprint',
	'shield-check',
	'shield-alert',
	'history',
	'clock-3',
	'sort-asc',
	'sort-desc',
	'list',
	'grid-2x2',
	'layout-dashboard',
	'panel-left',
	'panel-right',
]
const exportName = name =>
	`${name
		.split('-')
		.map(part => part[0].toUpperCase() + part.slice(1))
		.join('')}Icon`

// Kept rounded on purpose (round ends and joins, curved corners); GitHub is a filled brand mark
// Icons added after the inventory (receipts, tickets, WhatsApp...)
const EXTRA = [
	'clipboard-check',
	'cookie',
	'credit-card-plus',
	'message-square-more',
	'message-square-text',
	'panel-top',
	'receipt-text',
	'scroll-text',
	'shapes',
	'ticket',
	'whatsapp',
	'check-square',
	'circle-dollar-sign',
	'indian-rupee',
	'folder-tree',
	'arrow-down-circle',
	'arrow-left-circle',
	'arrow-right-circle',
	'circle-fading-arrow-left',
	'circle-fading-arrow-right',
	'circle-fading-arrow-up',
	'arrow-up-circle',
	'file-code2',
	'hard-drive',
	'network',
	'tag',
	'tags',
	'banknote',
	'dollar-sign',
	'euro',
	'japanese-yen',
	'pound-sterling',
	'russian-ruble',
	'swiss-franc',
	'circle-fading-arrow-down',
	'circle-users',
	'square-check',
	'thumbs-down',
	'thumbs-up',
	'ban',
	'arrow-up-right',
	'devices',
	'layout-grid',
	'book-open',
	'user-badge',
]

const ROUNDED = ['whatsapp', 'eye', 'eye-off', 'map-pin', 'rocket', 'shield', 'shield-check', 'shield-alert', 'github']

describe('icon inventory', () => {
	it.each(INVENTORY)('%s is exported as a component and renders', name => {
		const Icon = api[exportName(name)]
		expect(Icon, exportName(name)).toBeTypeOf('function')
		const { container } = render(<Icon className="h-6 w-6" />)
		const svg = container.querySelector('svg')
		expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
		expect(svg).toHaveAttribute('aria-hidden', 'true')
		expect(svg).toHaveAttribute('focusable', 'false')
		expect(svg).toHaveClass('h-6', 'w-6')
		expect(svg.querySelector('path, circle, rect, ellipse, polyline, polygon')).not.toBeNull()
	})

	it.each(EXTRA)('%s (added later) is exported and renders', name => {
		const Icon = api[exportName(name)]
		expect(Icon, exportName(name)).toBeTypeOf('function')
		const { container } = render(createElement(Icon, { className: 'h-6 w-6' }))
		expect(container.querySelector('svg')).toHaveClass('h-6', 'w-6')
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
	})

	it('has no duplicate or misspelled names', () => {
		expect(new Set(INVENTORY).size).toBe(INVENTORY.length)
		expect(INVENTORY).toHaveLength(139)
	})

	it('new icons inherit the text color, are 2px outlines and have a compact default size', () => {
		const { container } = render(<api.SearchIcon />)
		const svg = container.querySelector('svg')
		expect(svg).toHaveAttribute('stroke', 'currentColor')
		expect(svg).toHaveAttribute('fill', 'none')
		expect(svg).toHaveAttribute('stroke-width', '2')
		expect(svg).toHaveAttribute('stroke-linecap', 'square')
		expect(svg).toHaveClass('h-4', 'w-4')
	})

	it('draws every outline icon with square ends, mitred corners and no rounded rectangles', () => {
		for (const name of [...INVENTORY, ...EXTRA].filter(n => !ROUNDED.includes(n))) {
			const Icon = api[exportName(name)]
			const { container, unmount } = render(<Icon />)
			const html = container.innerHTML
			expect(html, name).not.toContain('"round"')
			// the database cylinder is the one shape whose top is a true ellipse; everything else has no rounded corners
			if (name !== 'database') expect(container.querySelector('[rx], [ry]'), name).toBeNull()
			unmount()
		}
	})

	it('draws Grid2x2 (one square split in four) differently from Grid (four separate squares)', () => {
		const { container } = render(
			<>
				<api.Grid2x2Icon />
				<api.GridIcon />
			</>
		)
		const [grid2x2, grid] = [...container.querySelectorAll('svg')]
		expect(grid2x2.querySelectorAll('rect')).toHaveLength(1)
		expect(grid.querySelectorAll('rect')).toHaveLength(4)
		expect(grid2x2.innerHTML).not.toBe(grid.innerHTML)
	})

	it('keeps eye, eye-off, map-pin, rocket and the shields rounded', () => {
		for (const name of ROUNDED.filter(n => n !== 'github' && n !== 'whatsapp')) {
			const { container, unmount } = render(createElement(api[exportName(name)]))
			const html = container.innerHTML
			expect(html, name).toContain('stroke-linecap="round"')
			expect(html, name).toContain('stroke-linejoin="round"')
			expect(html, name).not.toContain('"square"')
			unmount()
		}
	})

	it('keeps the original filled WhatsApp mark too', () => {
		const { container } = render(createElement(api.WhatsappIcon))
		const svg = container.querySelector('svg')
		expect(svg).toHaveAttribute('fill', 'currentColor')
		expect(svg).not.toHaveAttribute('stroke')
	})

	it('keeps the original filled GitHub mark instead of an outline redraw', () => {
		const { container } = render(<api.GithubIcon />)
		const svg = container.querySelector('svg')
		expect(svg).toHaveAttribute('fill', 'currentColor')
		expect(svg).not.toHaveAttribute('stroke')
		expect(svg.querySelectorAll('path')).toHaveLength(1)
		expect(svg.querySelector('path').getAttribute('d')).toMatch(/^M12 \.297c-6\.63/)
	})

	it('keeps the old names working next to the renamed ones', () => {
		expect(api.LogoutIcon).toBe(api.LogOutIcon)
		for (const old of ['CloseIcon', 'InfoIcon', 'RefreshIcon', 'SettingsIcon', 'PencilIcon']) {
			expect(api[old], old).toBeTypeOf('function')
		}
	})

	it('aliases draw the icon they are named after and pass props through', () => {
		const { container } = render(
			<>
				<api.MaximizeIcon className="alias" />
				<api.FullscreenIcon />
				<api.CircleHelpIcon />
				<api.HelpCircleIcon />
				<api.MinimizeIcon />
				<api.FullscreenExitIcon />
			</>
		)
		const svgs = [...container.querySelectorAll('svg')]
		expect(svgs[0]).toHaveClass('alias')
		const shape = svg => svg.innerHTML
		expect(shape(svgs[0])).toBe(shape(svgs[1]))
		expect(shape(svgs[2])).toBe(shape(svgs[3]))
		expect(shape(svgs[4])).toBe(shape(svgs[5]))
	})

	it('LayoutGrid is the same drawing as Grid', () => {
		const { container } = render(
			createElement('div', null, createElement(api.LayoutGridIcon), createElement(api.GridIcon))
		)
		const [a, b] = [...container.querySelectorAll('svg')]
		expect(a.innerHTML).toBe(b.innerHTML)
	})

	it('CheckSquare is the same drawing as SquareCheck', () => {
		const { container } = render(
			createElement('div', null, createElement(api.CheckSquareIcon), createElement(api.SquareCheckIcon))
		)
		const [a, b] = [...container.querySelectorAll('svg')]
		expect(a.innerHTML).toBe(b.innerHTML)
	})
})

describe('icons', () => {
	it('exports every icon', () => {
		expect(icons.length).toBe(213)
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
