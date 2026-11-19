// @vitest-environment node
// Server rendering: every component must render to a string in plain Node, where there is no `window` or `document`,
// without throwing and without React warnings (for example "useLayoutEffect does nothing on the server").
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import * as lib from '../../src/index'

const item = {
	id: 'a',
	key: 'a',
	label: 'Kevin',
	title: 'Kevin',
	name: 'Kevin',
	value: 'a',
	content: 'x',
	text: 'x',
	href: '#',
	children: [],
	description: 'd',
	date: '2026-01-01',
	msg: 'x',
	status: 'done',
	level: 'info',
	message: 'x',
	at: 1,
	timestamp: 1,
	type: 'file',
}
const items = [item, { ...item, id: 'b', key: 'b', value: 'b' }]
const column = { key: 'name', header: 'Name', render: row => row.name }
const row = { id: 1, name: 'Kevin' }
const series = [{ name: 's', label: 's', data: [1, 2], values: [1, 2] }]
const none = () => {}

// Props for the components that cannot render without any (a list needs items, an overlay is shown open)
const props = {
	Accordion: { items },
	ActionMenu: { trigger: 'Menu', items },
	AreaChart: { labels: ['a', 'b'], series },
	BarChart: { labels: ['a', 'b'], series },
	LineChart: { labels: ['a', 'b'], series },
	PieChart: { data: [{ label: 'a', name: 'a', value: 1 }] },
	Backdrop: { open: true, children: 'x' },
	Breadcrumb: { items },
	CommandPalette: { open: true, onClose: none, commands: items },
	ConfirmDialog: { open: true, onClose: none, onConfirm: none, title: 'T' },
	ContextMenu: { items, children: h('div', null, 'x') },
	DataGrid: { columns: [column], rows: [row] },
	Drawer: { open: true, onClose: none, title: 'T', children: 'x' },
	FileExplorer: { nodes: items },
	List: { items },
	LogViewer: { logs: items },
	Menu: { trigger: 'x', label: 'x', items },
	Modal: { open: true, onClose: none, title: 'T', children: 'x' },
	MultiSelect: { options: items },
	NestedTable: { columns: [column], rows: [row] },
	NotificationCenter: { notifications: items },
	Pagination: { page: 1, pageCount: 5, onChange: none },
	PasswordStrengthInfo: { password: 'abc' },
	PipelineGraph: { nodes: items },
	Popover: { trigger: 'x', label: 'x', children: 'x' },
	Portal: { children: 'x' },
	RadioGroup: { options: items },
	SearchSelect: { options: items },
	Select: { options: items },
	Sidebar: { items },
	SortableList: { items, onChange: none, renderItem: i => i.label },
	Stepper: { steps: items },
	Table: { columns: [column], rows: [row] },
	Tabs: { items },
	Timeline: { items },
	Tooltip: { text: 't', children: h('button', null, 'x') },
	TransferList: { items },
	Tree: { nodes: items },
	VirtualList: { items, itemHeight: 20, renderItem: i => i.label },
	Image: { src: 'x.png', alt: 'x' },
	Video: {
		sources: [
			{ label: '720p', src: 'a.mp4' },
			{ label: '1080p', src: 'b.mp4' },
		],
	},
}

// Not components: a context object
const skip = new Set(['ThemeContext'])

const components = Object.entries(lib).filter(
	([name, value]) =>
		/^[A-Z]/.test(name) &&
		!skip.has(name) &&
		(typeof value === 'function' || (value && typeof value === 'object' && '$$typeof' in value))
)

describe('server rendering', () => {
	it('has no window or document', () => {
		expect(typeof window).toBe('undefined')
		expect(typeof document).toBe('undefined')
	})

	it('finds every component', () => {
		expect(components.length).toBeGreaterThan(100)
	})

	it.each(components)('renders %s to a string with no warnings', (name, Component) => {
		const logged = []
		const record = (...args) => logged.push(args.map(String).join(' ').split('\n')[0])
		const error = console.error
		const warn = console.warn
		console.error = record
		console.warn = record
		try {
			const html = renderToString(h(Component, props[name] ?? {}))
			expect(typeof html).toBe('string')
		} finally {
			console.error = error
			console.warn = warn
		}
		expect(logged).toEqual([])
	})

	it('renders an open overlay as nothing on the server', () => {
		for (const name of ['Modal', 'Drawer', 'ConfirmDialog', 'CommandPalette', 'Backdrop', 'Portal']) {
			expect(renderToString(h(lib[name], props[name])), name).toBe('')
		}
	})
})
