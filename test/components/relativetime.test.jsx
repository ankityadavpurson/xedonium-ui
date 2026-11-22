import { act, fireEvent, render, screen } from '@testing-library/react'
import RelativeTime from '../../src/components/RelativeTime'

const NOW = new Date('2026-11-22T12:00:00Z')
const minutesAgo = n => new Date(NOW.getTime() - n * 60_000).toISOString()
const tooltip = () => document.body.querySelector('.pointer-events-none.fixed')

describe('RelativeTime', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(NOW)
	})
	afterEach(() => {
		vi.useRealTimers()
	})

	it('renders a <time> element with the ISO time and a relative label', () => {
		render(<RelativeTime date={minutesAgo(3)} />)
		const time = screen.getByText('3 minutes ago')
		expect(time.tagName).toBe('TIME')
		expect(time).toHaveAttribute('dateTime', '2026-11-22T11:57:00.000Z')
	})

	it('takes a Date or a timestamp too', () => {
		render(
			<>
				<RelativeTime date={new Date(minutesAgo(5))} />
				<RelativeTime date={Date.parse(minutesAgo(7))} />
			</>
		)
		expect(screen.getByText('5 minutes ago')).toBeInTheDocument()
		expect(screen.getByText('7 minutes ago')).toBeInTheDocument()
	})

	it('is focusable and described by the full date and time', () => {
		render(<RelativeTime date="2026-11-22T11:15:30Z" />)
		const time = screen.getByText('45 minutes ago')
		expect(time).toHaveAttribute('tabindex', '0')
		const full = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'long' }).format(
			new Date('2026-11-22T11:15:30Z')
		)
		expect(time).toHaveAccessibleDescription(full)
		expect(time).toHaveClass('cursor-help', 'decoration-dotted')
	})

	it('shows the full date and time in a tooltip on hover', () => {
		render(<RelativeTime date={minutesAgo(3)} />)
		fireEvent.mouseEnter(screen.getByText('3 minutes ago').parentElement)
		expect(tooltip()).toHaveTextContent('Nov 22, 2026')
	})

	it('can leave out the tooltip', () => {
		render(<RelativeTime date={minutesAgo(3)} tooltip={false} className="text-app-muted" />)
		const time = screen.getByText('3 minutes ago')
		expect(time).not.toHaveAttribute('tabindex')
		expect(time).not.toHaveAccessibleDescription()
		expect(time).toHaveClass('text-app-muted')
		expect(time).not.toHaveClass('cursor-help')
	})

	it('formats in English by default and in the given locale', () => {
		render(
			<>
				<RelativeTime date={minutesAgo(24 * 60)} />
				<RelativeTime date={minutesAgo(24 * 60)} locale="fr" />
			</>
		)
		expect(screen.getByText('yesterday')).toBeInTheDocument()
		const french = screen.getByText('hier')
		expect(french).toHaveAccessibleDescription(/^21 nov\. 2026/)
	})

	it('keeps moving: the label updates every 30 seconds', () => {
		render(<RelativeTime date={NOW.toISOString()} />)
		expect(screen.getByText('now')).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(30_000))
		expect(screen.getByText('30 seconds ago')).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(60_000))
		expect(screen.getByText('2 minutes ago')).toBeInTheDocument()
	})

	it('shares one timer between every instance and stops it when none is left', () => {
		expect(vi.getTimerCount()).toBe(0)
		const first = render(
			<>
				<RelativeTime date={minutesAgo(1)} />
				<RelativeTime date={minutesAgo(2)} />
				<RelativeTime date={minutesAgo(3)} />
			</>
		)
		expect(vi.getTimerCount()).toBe(1)
		const second = render(<RelativeTime date={minutesAgo(4)} />)
		expect(vi.getTimerCount()).toBe(1)
		first.unmount()
		expect(vi.getTimerCount()).toBe(1)
		second.unmount()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('updates on a custom tick', () => {
		render(<RelativeTime date={NOW.toISOString()} tick={5000} />)
		expect(screen.getByText('now')).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(5000))
		expect(screen.getByText('5 seconds ago')).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(5000))
		expect(screen.getByText('10 seconds ago')).toBeInTheDocument()
	})

	it('shares one timer per tick', () => {
		const { unmount } = render(
			<>
				<RelativeTime date={minutesAgo(1)} />
				<RelativeTime date={minutesAgo(2)} tick={30_000} />
				<RelativeTime date={minutesAgo(3)} tick={5000} />
				<RelativeTime date={minutesAgo(4)} tick={5000} />
			</>
		)
		expect(vi.getTimerCount()).toBe(2)
		unmount()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('moves to the new tick when the prop changes', () => {
		const { rerender } = render(<RelativeTime date={NOW.toISOString()} />)
		rerender(<RelativeTime date={NOW.toISOString()} tick={2000} />)
		expect(vi.getTimerCount()).toBe(1)
		act(() => vi.advanceTimersByTime(2000))
		expect(screen.getByText('2 seconds ago')).toBeInTheDocument()
	})

	it('raises a tick under a second to one second, and falls back to 30 seconds for an invalid one', () => {
		const fast = render(<RelativeTime date={NOW.toISOString()} tick={10} />)
		act(() => vi.advanceTimersByTime(999))
		expect(screen.getByText('now')).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(1))
		expect(screen.getByText('1 second ago')).toBeInTheDocument()
		fast.unmount()

		vi.setSystemTime(NOW)
		render(<RelativeTime date={NOW.toISOString()} tick={-5} />)
		act(() => vi.advanceTimersByTime(29_999))
		expect(screen.getByText('now')).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(1))
		expect(screen.getByText('30 seconds ago')).toBeInTheDocument()
	})

	it.each([false, 0])('does not update with tick={%s}, and runs no timer', tick => {
		const { rerender } = render(<RelativeTime date={NOW.toISOString()} tick={tick} />)
		expect(screen.getByText('now')).toBeInTheDocument()
		expect(vi.getTimerCount()).toBe(0)
		act(() => vi.advanceTimersByTime(5 * 60_000))
		expect(screen.getByText('now')).toBeInTheDocument()
		// a render from the parent works the label out again
		rerender(<RelativeTime date={NOW.toISOString()} tick={tick} className="x" />)
		expect(screen.getByText('5 minutes ago')).toBeInTheDocument()
	})

	it('reads the current time when it mounts after a pause', () => {
		const { unmount } = render(<RelativeTime date={NOW.toISOString()} />)
		unmount()
		vi.setSystemTime(new Date(NOW.getTime() + 10 * 60_000))
		render(<RelativeTime date={NOW.toISOString()} />)
		expect(screen.getByText('10 minutes ago')).toBeInTheDocument()
	})

	it('renders nothing for an invalid date', () => {
		const { container } = render(<RelativeTime date="not a date" />)
		expect(container).toBeEmptyDOMElement()
	})
})
