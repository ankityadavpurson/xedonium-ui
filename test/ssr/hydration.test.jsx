// Hydration: the markup a server renders must match the browser's first render, or React logs a mismatch and
// throws the server markup away. The server half runs without `window` and `document`, like a real server.
import { act } from '@testing-library/react'
import { createElement as h } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'

const none = () => {}
const sources = [
	{ label: '720p', src: 'a.mp4' },
	{ label: '1080p', src: 'b.mp4' },
]

// name, props: what the page renders, with the overlays open
const cases = [
	['Modal', { open: true, onClose: none, title: 'T', children: 'x' }],
	['Drawer', { open: true, onClose: none, title: 'T', children: 'x' }],
	['Tooltip', { text: 't', children: h('button', null, 'x') }],
	['Calendar', {}],
	['AppShell', { header: 'h', sidebarCollapsedBelow: 'lg', sidebar: () => h('nav', null, 'side'), children: 'Main' }],
	['NetworkConnection', { variant: 'banner' }],
	['NetworkConnection', { variant: 'panel', showConnectionInfo: true }],
	['Select', { options: [{ value: 'a', label: 'A' }], value: 'a', onChange: none }],
	['DatePicker', {}],
	['Video', { sources }],
	['ThemeToggle', {}],
	['RelativeTime', { date: '2026-01-01T00:00:00Z' }],
	['RelativeTime', { date: '2026-01-01T00:00:00Z', locale: 'fr', tooltip: false }],
]

const modules = import.meta.glob('../../src/components/*.tsx')

// Renders on a "server" (no window or document, modules loaded fresh), then hydrates in the browser environment
const serverHtml = async (name, props) => {
	vi.resetModules()
	vi.stubGlobal('window', undefined)
	vi.stubGlobal('document', undefined)
	try {
		const { default: Component } = await modules[`../../src/components/${name}.tsx`]()
		return renderToString(h(Component, props))
	} finally {
		vi.unstubAllGlobals()
	}
}

describe('hydration', () => {
	it.each(cases)(
		'%s matches the server markup',
		async (name, props) => {
			const html = await serverHtml(name, props)
			vi.resetModules()
			const { default: Component } = await modules[`../../src/components/${name}.tsx`]()
			const container = document.createElement('div')
			container.innerHTML = html
			document.body.append(container)
			const logged = []
			vi.spyOn(console, 'error').mockImplementation((...args) => logged.push(args.map(String).join(' ').split('\n')[0]))
			let root
			await act(async () => {
				root = hydrateRoot(container, h(Component, props))
			})
			expect(logged).toEqual([])
			act(() => root.unmount())
			container.remove()
		},
		30000
	)
})

describe('RelativeTime after hydration', () => {
	afterEach(() => vi.useRealTimers())

	it('replaces the label of a page rendered days earlier (a static build) with the current one', async () => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date('2026-11-22T12:05:00Z'))
		const props = { date: '2026-11-22T12:00:00Z' }
		const html = await serverHtml('RelativeTime', props)
		expect(html).toContain('5 minutes ago')
		// the visitor opens the page three days after it was built
		vi.setSystemTime(new Date('2026-11-25T12:05:00Z'))
		vi.resetModules()
		const { default: RelativeTime } = await modules['../../src/components/RelativeTime.tsx']()
		const container = document.createElement('div')
		container.innerHTML = html
		document.body.append(container)
		const logged = []
		vi.spyOn(console, 'error').mockImplementation((...args) => logged.push(String(args[0])))
		let root
		await act(async () => {
			root = hydrateRoot(container, h(RelativeTime, props))
		})
		expect(logged).toEqual([])
		expect(container.querySelector('time')).toHaveTextContent('3 days ago')
		act(() => root.unmount())
		container.remove()
	})
})
