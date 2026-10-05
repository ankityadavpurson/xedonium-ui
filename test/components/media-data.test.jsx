import { act, fireEvent, render, screen, within } from '@testing-library/react'
import Carousel from '../../src/components/Carousel'
import CommandPalette from '../../src/components/CommandPalette'
import DataGrid from '../../src/components/DataGrid'
import NotificationCenter from '../../src/components/NotificationCenter'
import RackServer from '../../src/components/RackServer'
import Video from '../../src/components/Video'

describe('Video', () => {
	const setup = (props = {}) => {
		const utils = render(<Video src="/v.mp4" title="Clip" {...props} />)
		const video = utils.container.querySelector('video')
		Object.defineProperty(video, 'paused', { value: true, writable: true, configurable: true })
		video.play = vi.fn().mockImplementation(() => {
			video.paused = false
			return Promise.resolve()
		})
		video.pause = vi.fn().mockImplementation(() => {
			video.paused = true
		})
		return { video, ...utils }
	}

	it('plays and pauses via button and clicking the video', async () => {
		const { video } = setup()
		fireEvent.click(screen.getByRole('button', { name: 'Play' }))
		expect(video.play).toHaveBeenCalled()
		fireEvent.play(video)
		expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
		fireEvent.click(video)
		expect(video.pause).toHaveBeenCalled()
		fireEvent.pause(video)
		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
	})

	it('swallows play() rejections', async () => {
		const { video } = setup()
		video.play = vi.fn().mockRejectedValue(new Error('blocked'))
		fireEvent.click(video)
		await Promise.resolve()
		expect(video.play).toHaveBeenCalled()
	})

	it('shows time and duration and seeks', () => {
		const { video } = setup()
		Object.defineProperty(video, 'duration', { value: 125, configurable: true })
		Object.defineProperty(video, 'currentTime', { value: 65, writable: true, configurable: true })
		fireEvent.loadedMetadata(video)
		fireEvent.timeUpdate(video)
		expect(screen.getByText('2:05')).toBeInTheDocument()
		expect(screen.getByText('1:05')).toBeInTheDocument()
		fireEvent.change(screen.getByLabelText('Seek'), { target: { value: '90' } })
		expect(video.currentTime).toBe(90)
		expect(screen.getByText('1:30')).toBeInTheDocument()
	})

	it('formats non-finite durations as 0:00', () => {
		const { video } = setup()
		Object.defineProperty(video, 'duration', { value: Infinity, configurable: true })
		fireEvent.loadedMetadata(video)
		expect(screen.getAllByText('0:00')).toHaveLength(2)
	})

	it('toggles mute', () => {
		setup()
		fireEvent.click(screen.getByRole('button', { name: 'Mute' }))
		expect(screen.getByRole('button', { name: 'Unmute' })).toHaveAttribute('aria-pressed', 'true')
		fireEvent.click(screen.getByRole('button', { name: 'Unmute' }))
		expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument()
	})

	it('enters and leaves fullscreen', () => {
		const { container } = setup({ ratio: 'none', className: 'k' })
		const wrap = container.firstChild
		wrap.requestFullscreen = vi.fn()
		document.exitFullscreen = vi.fn()
		fireEvent.click(screen.getByRole('button', { name: 'Full' }))
		expect(wrap.requestFullscreen).toHaveBeenCalled()
		Object.defineProperty(document, 'fullscreenElement', { value: wrap, configurable: true })
		fireEvent(document, new Event('fullscreenchange'))
		expect(screen.getByRole('button', { name: 'Exit' })).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Exit' }))
		expect(document.exitFullscreen).toHaveBeenCalled()
		Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true })
		fireEvent(document, new Event('fullscreenchange'))
		expect(screen.getByRole('button', { name: 'Full' })).toBeInTheDocument()
		wrap.requestFullscreen = undefined
		fireEvent.click(screen.getByRole('button', { name: 'Full' }))
		delete document.fullscreenElement
		delete document.exitFullscreen
	})

	it('forwards extra props and children', () => {
		const { video } = setup({ controls: false, 'data-x': '1', children: <track kind="captions" /> })
		expect(video).toHaveAttribute('data-x', '1')
		expect(screen.getByRole('group', { name: 'Clip controls' })).toBeInTheDocument()
	})
})

describe('Carousel', () => {
	const slides = ['One', 'Two', 'Three'].map(s => <div key={s}>{s}</div>)

	it('moves between slides and wraps when looping', () => {
		const onIndexChange = vi.fn()
		render(<Carousel onIndexChange={onIndexChange}>{slides}</Carousel>)
		const region = screen.getByRole('region', { name: 'Carousel' })
		fireEvent.click(screen.getByLabelText('Next slide'))
		expect(onIndexChange).toHaveBeenLastCalledWith(1)
		fireEvent.click(screen.getByLabelText('Previous slide'))
		fireEvent.click(screen.getByLabelText('Previous slide'))
		expect(onIndexChange).toHaveBeenLastCalledWith(2)
		fireEvent.click(screen.getByLabelText('Go to slide 2'))
		expect(onIndexChange).toHaveBeenLastCalledWith(1)
		fireEvent.keyDown(region, { key: 'ArrowRight' })
		fireEvent.keyDown(region, { key: 'ArrowLeft' })
		fireEvent.keyDown(region, { key: 'x' })
		expect(onIndexChange).toHaveBeenCalledTimes(6)
	})

	it('clamps and disables arrows when not looping', () => {
		render(
			<Carousel loop={false} defaultIndex={0}>
				{slides}
			</Carousel>
		)
		expect(screen.getByLabelText('Previous slide')).toBeDisabled()
		fireEvent.click(screen.getByLabelText('Next slide'))
		fireEvent.click(screen.getByLabelText('Next slide'))
		expect(screen.getByLabelText('Next slide')).toBeDisabled()
		fireEvent.click(screen.getByLabelText('Go to slide 3'))
		expect(screen.getByLabelText('Go to slide 3')).toHaveAttribute('aria-current', 'true')
		fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' })
		expect(screen.getByLabelText('Go to slide 3')).toHaveAttribute('aria-current', 'true')
	})

	it('can be controlled', () => {
		const onIndexChange = vi.fn()
		render(
			<Carousel index={1} onIndexChange={onIndexChange}>
				{slides}
			</Carousel>
		)
		fireEvent.click(screen.getByLabelText('Next slide'))
		expect(onIndexChange).toHaveBeenCalledWith(2)
		expect(screen.getByLabelText('Go to slide 2')).toHaveAttribute('aria-current', 'true')
		const groups = screen.getAllByRole('group', { hidden: true })
		expect(groups[1]).not.toHaveAttribute('inert')
		expect(groups[0]).toHaveAttribute('inert')
	})

	it('renders a single slide without controls and handles no slides', () => {
		const { rerender } = render(<Carousel>{[<div key="a">Solo</div>]}</Carousel>)
		expect(screen.queryByLabelText('Next slide')).toBeNull()
		rerender(<Carousel>{[]}</Carousel>)
		expect(screen.getByRole('region')).toBeInTheDocument()
	})

	it('auto-plays and pauses on hover and focus', () => {
		vi.useFakeTimers()
		render(<Carousel autoPlay={1000}>{slides}</Carousel>)
		const region = screen.getByRole('region')
		act(() => vi.advanceTimersByTime(1000))
		expect(screen.getByLabelText('Go to slide 2')).toHaveAttribute('aria-current', 'true')
		fireEvent.mouseEnter(region)
		act(() => vi.advanceTimersByTime(5000))
		expect(screen.getByLabelText('Go to slide 2')).toHaveAttribute('aria-current', 'true')
		fireEvent.mouseLeave(region)
		act(() => vi.advanceTimersByTime(1000))
		expect(screen.getByLabelText('Go to slide 3')).toHaveAttribute('aria-current', 'true')
		fireEvent.focus(region)
		act(() => vi.advanceTimersByTime(5000))
		expect(screen.getByLabelText('Go to slide 3')).toHaveAttribute('aria-current', 'true')
		fireEvent.blur(region)
		act(() => vi.advanceTimersByTime(1000))
		expect(screen.getByLabelText('Go to slide 1')).toHaveAttribute('aria-current', 'true')
	})
})

describe('RackServer', () => {
	it('injects styles once and spins the fans', () => {
		const frames = []
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => frames.push(cb))
		const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
		const first = render(<RackServer />)
		const second = render(<RackServer />)
		expect(document.querySelectorAll('#rack-server-styles')).toHaveLength(1)
		const t0 = performance.now()
		act(() => frames[0](t0))
		act(() => frames[0] && frames.shift()(t0 + 10000))
		act(() => frames.shift()(t0 + 11000))
		const rotations = [...first.container.querySelectorAll('g[transform]')].map(g => g.getAttribute('transform'))
		expect(rotations.length).toBe(2)
		expect(rotations.every(r => r.startsWith('rotate('))).toBe(true)
		first.unmount()
		second.unmount()
		expect(cancel).toHaveBeenCalled()
	})
})

describe('NotificationCenter', () => {
	const notifications = [
		{ id: 1, title: 'New', body: 'body', time: '1m' },
		{ id: 2, title: 'Old', read: true },
	]

	it('shows the unread badge and opens the list', () => {
		render(<NotificationCenter notifications={notifications} />)
		const bell = screen.getByRole('button', { name: 'Notifications, 1 unread' })
		fireEvent.click(bell)
		const dialog = screen.getByRole('dialog', { name: 'Notifications' })
		expect(within(dialog).getByText('body')).toBeInTheDocument()
		expect(within(dialog).getByText('1m')).toBeInTheDocument()
		expect(within(dialog).getByText('Unread')).toBeInTheDocument()
		expect(within(dialog).queryByText('Mark all read')).toBeNull()
		expect(within(dialog).queryByText('Clear')).toBeNull()
	})

	it('selects, marks read, marks all and clears', () => {
		const onSelect = vi.fn()
		const onMarkRead = vi.fn()
		const onMarkAllRead = vi.fn()
		const onClear = vi.fn()
		render(
			<NotificationCenter
				notifications={notifications}
				onSelect={onSelect}
				onMarkRead={onMarkRead}
				onMarkAllRead={onMarkAllRead}
				onClear={onClear}
				align="start"
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: /Notifications/ }))
		fireEvent.click(screen.getByText('New'))
		expect(onMarkRead).toHaveBeenCalledWith(1)
		expect(onSelect).toHaveBeenCalledWith(notifications[0])
		fireEvent.click(screen.getByText('Old'))
		expect(onMarkRead).toHaveBeenCalledTimes(1)
		fireEvent.click(screen.getByText('Mark all read'))
		expect(onMarkAllRead).toHaveBeenCalled()
		fireEvent.click(screen.getByText('Clear'))
		expect(onClear).toHaveBeenCalled()
	})

	it('selects without handlers and caps the badge at 9+', () => {
		const many = Array.from({ length: 12 }, (_, i) => ({ id: i, title: `n${i}` }))
		render(<NotificationCenter notifications={many} />)
		expect(screen.getByText('9+')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button'))
		fireEvent.click(screen.getByText('n0'))
	})

	it('shows the empty state and closes on Escape and outside click', () => {
		render(<NotificationCenter notifications={[]} empty="Nothing here" />)
		const bell = screen.getByRole('button', { name: 'Notifications' })
		fireEvent.click(bell)
		expect(screen.getByText('Nothing here')).toBeInTheDocument()
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(bell).toHaveFocus()
		fireEvent.click(bell)
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('dialog')).toBeNull()
		fireEvent.click(bell)
		fireEvent.click(bell)
		expect(screen.queryByRole('dialog')).toBeNull()
	})
})

describe('CommandPalette', () => {
	const makeCommands = () => [
		{ key: 'new', label: 'New file', description: 'Create', group: 'File', shortcut: 'N', onSelect: vi.fn() },
		{ key: 'open', label: 'Open file', group: 'File', onSelect: vi.fn() },
		{ key: 'theme', label: 'Toggle theme', group: 'View', onSelect: vi.fn() },
		{ key: 'about', label: 'About' },
	]

	it('renders nothing while closed', () => {
		render(<CommandPalette open={false} onClose={() => {}} commands={makeCommands()} />)
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('lists grouped commands with the first active and focuses the input', () => {
		render(<CommandPalette open onClose={() => {}} commands={makeCommands()} />)
		expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
		expect(screen.getByLabelText('Search commands')).toHaveFocus()
		expect(screen.getAllByText('File')).toHaveLength(1)
		expect(screen.getByText('View')).toBeInTheDocument()
		expect(screen.getByText('N')).toBeInTheDocument()
		expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
	})

	it('filters, shows the empty message, and resets on reopen', () => {
		const props = { onClose: () => {}, commands: makeCommands() }
		const { rerender } = render(<CommandPalette open {...props} empty="Zip" />)
		const input = screen.getByLabelText('Search commands')
		fireEvent.change(input, { target: { value: 'theme' } })
		expect(screen.getAllByRole('option')).toHaveLength(1)
		fireEvent.change(input, { target: { value: 'create' } })
		expect(screen.getByText('New file')).toBeInTheDocument()
		fireEvent.change(input, { target: { value: 'zzz' } })
		expect(screen.getByText('Zip')).toBeInTheDocument()
		fireEvent.keyDown(input, { key: 'Enter' })
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		rerender(<CommandPalette open={false} {...props} />)
		rerender(<CommandPalette open {...props} />)
		expect(screen.getByLabelText('Search commands')).toHaveValue('')
	})

	it('moves with arrow keys (wrapping) and runs with Enter', () => {
		const onClose = vi.fn()
		const commands = makeCommands()
		render(<CommandPalette open onClose={onClose} commands={commands} />)
		const input = screen.getByLabelText('Search commands')
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		expect(screen.getAllByRole('option')[3]).toHaveAttribute('aria-selected', 'true')
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(commands[1].onSelect).toHaveBeenCalled()
		expect(onClose).toHaveBeenCalled()
		fireEvent.keyDown(input, { key: 'a' })
	})

	it('runs by click, highlights on hover, and tolerates commands without onSelect', () => {
		const onClose = vi.fn()
		const commands = makeCommands()
		render(<CommandPalette open onClose={onClose} commands={commands} />)
		fireEvent.mouseMove(screen.getByText('Toggle theme'))
		expect(screen.getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')
		fireEvent.click(screen.getByText('Toggle theme'))
		expect(commands[2].onSelect).toHaveBeenCalled()
		fireEvent.click(screen.getByText('About'))
		expect(onClose).toHaveBeenCalledTimes(2)
	})

	it('closes on Escape and backdrop click and scrolls the active row into view', () => {
		const onClose = vi.fn()
		const scroll = vi.fn()
		Element.prototype.scrollIntoView = scroll
		render(<CommandPalette open onClose={onClose} commands={makeCommands()} placeholder="Find" />)
		expect(screen.getByPlaceholderText('Find')).toBeInTheDocument()
		expect(scroll).toHaveBeenCalled()
		fireEvent.keyDown(window, { key: 'Escape' })
		fireEvent.click(document.querySelector('[aria-hidden="true"].absolute'))
		expect(onClose).toHaveBeenCalledTimes(2)
		delete Element.prototype.scrollIntoView
	})

	it('handles an empty command list', () => {
		render(<CommandPalette open onClose={() => {}} commands={[]} />)
		fireEvent.keyDown(screen.getByLabelText('Search commands'), { key: 'ArrowDown' })
		fireEvent.keyDown(screen.getByLabelText('Search commands'), { key: 'ArrowUp' })
		expect(screen.getByText('No matching commands')).toBeInTheDocument()
	})
})

describe('DataGrid', () => {
	const columns = [
		{ key: 'name', header: 'Name', sortable: true },
		{ key: 'age', header: 'Age', sortable: true, align: 'right' },
		{ key: 'city', header: 'City', render: r => <i>{r.city}</i>, accessor: r => r.city },
		{ key: 'note', header: 'Note' },
	]
	const rows = [
		{ id: 1, name: 'Cara', age: 30, city: 'Paris' },
		{ id: 2, name: 'Abe', age: 25, city: 'Rome', note: null },
		{ id: 3, name: 'Bea', age: null, city: 'Oslo' },
		{ id: 4, name: 'Dan', age: 41, city: 'Lima' },
		{ id: 5, name: 'Eve', age: 41, city: 'Cairo' },
	]
	const names = () =>
		screen
			.getAllByRole('row')
			.slice(1)
			.map(r => within(r).getAllByRole('cell')[0].textContent)

	it('renders rows and a count', () => {
		render(<DataGrid columns={columns} rows={rows} caption="People" />)
		expect(names()).toEqual(['Cara', 'Abe', 'Bea', 'Dan', 'Eve'])
		expect(screen.getByText('5 rows')).toBeInTheDocument()
		expect(screen.getByText('People')).toBeInTheDocument()
		expect(screen.getByRole('columnheader', { name: 'Note' })).not.toHaveAttribute('aria-sort')
	})

	it('cycles sorting asc -> desc -> none and sorts numbers/null last', () => {
		render(<DataGrid columns={columns} rows={rows} />)
		fireEvent.click(screen.getByRole('button', { name: /Name/ }))
		expect(names()).toEqual(['Abe', 'Bea', 'Cara', 'Dan', 'Eve'])
		expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
		fireEvent.click(screen.getByRole('button', { name: /Name/ }))
		expect(names()[0]).toBe('Eve')
		expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending')
		fireEvent.click(screen.getByRole('button', { name: /Name/ }))
		expect(names()).toEqual(['Cara', 'Abe', 'Bea', 'Dan', 'Eve'])
		fireEvent.click(screen.getByRole('button', { name: /Age/ }))
		expect(names()).toEqual(['Abe', 'Cara', 'Dan', 'Eve', 'Bea'])
		fireEvent.click(screen.getByRole('button', { name: /Age/ }))
		expect(names()[0]).toBe('Bea')
		expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'none')
	})

	it('searches across accessor values, resets the page and shows the empty state', () => {
		render(<DataGrid columns={columns} rows={rows} searchable empty="Nope" />)
		const search = screen.getByLabelText('Search rows')
		fireEvent.change(search, { target: { value: 'ROME' } })
		expect(names()).toEqual(['Abe'])
		expect(screen.getByText('1 row')).toBeInTheDocument()
		fireEvent.change(search, { target: { value: 'zzz' } })
		expect(screen.getByText('Nope')).toHaveAttribute('colspan', '4')
	})

	it('paginates', () => {
		render(<DataGrid columns={columns} rows={rows} pageSize={2} />)
		expect(names()).toEqual(['Cara', 'Abe'])
		fireEvent.click(screen.getByText('Next'))
		expect(names()).toEqual(['Bea', 'Dan'])
		fireEvent.click(screen.getByRole('button', { name: /Name/ })) // sorting resets to page 1
		expect(names()).toEqual(['Abe', 'Bea'])
	})

	it('supports uncontrolled selection with select-all per page', () => {
		const onSelectionChange = vi.fn()
		render(<DataGrid columns={columns} rows={rows} pageSize={2} selectable onSelectionChange={onSelectionChange} />)
		fireEvent.click(screen.getByLabelText('Select row 1'))
		expect(onSelectionChange).toHaveBeenLastCalledWith([1])
		expect(screen.getByText('5 rows, 1 selected')).toBeInTheDocument()
		const all = screen.getByLabelText('Select all rows on this page')
		expect(all.indeterminate).toBe(true)
		fireEvent.click(all)
		expect(onSelectionChange).toHaveBeenLastCalledWith([1, 2])
		fireEvent.click(all)
		expect(onSelectionChange).toHaveBeenLastCalledWith([])
		fireEvent.click(screen.getByLabelText('Select row 2'))
		fireEvent.click(screen.getByLabelText('Select row 2'))
		expect(screen.getAllByRole('row', { selected: false }).length).toBeGreaterThan(0)
	})

	it('supports controlled selection', () => {
		const onSelectionChange = vi.fn()
		render(<DataGrid columns={columns} rows={rows} selectable selected={[2]} onSelectionChange={onSelectionChange} />)
		expect(screen.getByLabelText('Select row 2')).toBeChecked()
		fireEvent.click(screen.getByLabelText('Select row 3'))
		expect(onSelectionChange).toHaveBeenCalledWith([2, 3])
		expect(screen.getByLabelText('Select row 3')).not.toBeChecked()
		fireEvent.click(screen.getByLabelText('Select row 2'))
		expect(onSelectionChange).toHaveBeenLastCalledWith([])
	})

	it('select-all is unchecked on an empty page and rowKey is configurable', () => {
		render(<DataGrid columns={columns} rows={[]} selectable />)
		expect(screen.getByLabelText('Select all rows on this page')).not.toBeChecked()
		expect(screen.getByText('0 rows')).toBeInTheDocument()
	})

	it('uses a custom rowKey', () => {
		render(
			<DataGrid
				columns={[{ key: 'name', header: 'N' }]}
				rows={[{ name: 'a' }, { name: 'b' }]}
				rowKey="name"
				selectable
			/>
		)
		expect(screen.getByLabelText('Select row a')).toBeInTheDocument()
	})
})
