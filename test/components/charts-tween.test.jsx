import { act, render, renderHook, screen } from '@testing-library/react'
import BarChart from '../../src/components/BarChart'
import LineChart from '../../src/components/LineChart'
import PieChart from '../../src/components/PieChart'
import useTween from '../../src/components/charts/useTween'

// A hand-cranked animation clock: nothing moves until tick() is called
let frames
let nextId
let clock

beforeEach(() => {
	frames = new Map()
	nextId = 1
	clock = 0
	vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
		frames.set(nextId, callback)
		return nextId++
	})
	vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => frames.delete(id))
	vi.spyOn(performance, 'now').mockImplementation(() => clock)
})

const tick = ms => {
	clock += ms
	const due = [...frames.values()]
	frames.clear()
	act(() => due.forEach(callback => callback(clock)))
}

const reducedMotion = matches =>
	vi
		.spyOn(window, 'matchMedia')
		.mockImplementation(() => ({ matches, addEventListener() {}, removeEventListener() {} }))

describe('useTween', () => {
	it('starts at the targets, then glides to new ones and stops there', () => {
		const { result, rerender } = renderHook(({ targets }) => useTween(targets), { initialProps: { targets: [0, 100] } })
		expect(result.current).toEqual([0, 100])
		rerender({ targets: [100, 0] })
		tick(0)
		expect(result.current).toEqual([0, 100])
		tick(150)
		expect(result.current[0]).toBeGreaterThan(0)
		expect(result.current[0]).toBeLessThan(100)
		expect(result.current[0] + result.current[1]).toBeCloseTo(100)
		tick(1000)
		expect(result.current).toEqual([100, 0])
		expect(frames.size).toBe(0)
	})

	it('continues from where an interrupted glide had got to', () => {
		const { result, rerender } = renderHook(({ targets }) => useTween(targets), { initialProps: { targets: [0] } })
		rerender({ targets: [100] })
		tick(0)
		tick(150)
		const midway = result.current[0]
		rerender({ targets: [0] })
		tick(0)
		tick(1)
		expect(result.current[0]).toBeGreaterThan(0)
		expect(Math.abs(result.current[0] - midway)).toBeLessThan(5)
	})

	it('jumps when disabled, when the length or snapKey changes, and for reduced motion', () => {
		const { result, rerender } = renderHook(props => useTween(props.targets, props.options), {
			initialProps: { targets: [0, 0], options: { enabled: false } },
		})
		rerender({ targets: [5, 6], options: { enabled: false } })
		expect(result.current).toEqual([5, 6])

		rerender({ targets: [1, 2, 3], options: { enabled: true } })
		expect(result.current).toEqual([1, 2, 3])
		rerender({ targets: [9, 9, 9], options: { enabled: true, snapKey: '300x200' } })
		expect(result.current).toEqual([9, 9, 9])

		reducedMotion(true)
		rerender({ targets: [0, 0, 0], options: { enabled: true, snapKey: '300x200' } })
		expect(result.current).toEqual([0, 0, 0])
		expect(frames.size).toBe(0)
	})

	it('does not animate when the values did not change, even with a new array', () => {
		const { result, rerender } = renderHook(({ targets }) => useTween(targets), { initialProps: { targets: [1, 2] } })
		rerender({ targets: [1, 2] })
		expect(frames.size).toBe(0)
		expect(result.current).toEqual([1, 2])
	})

	it('cancels a running glide on unmount', () => {
		const { rerender, unmount } = renderHook(({ targets }) => useTween(targets), { initialProps: { targets: [0] } })
		rerender({ targets: [10] })
		expect(frames.size).toBe(1)
		unmount()
		expect(frames.size).toBe(0)
	})
})

describe('charts glide when the data changes', () => {
	const labels = ['a', 'b']

	it('BarChart: bars move to their new height instead of redrawing', () => {
		const { container, rerender } = render(<BarChart labels={labels} series={[{ name: 'S', values: [10, 40] }]} />)
		const bar = () => container.querySelectorAll('rect.xd-chart-bar')[0]
		const first = bar()
		const before = Number(first.getAttribute('height'))
		rerender(<BarChart labels={labels} series={[{ name: 'S', values: [30, 40] }]} />)
		tick(0)
		tick(120)
		const during = Number(bar().getAttribute('height'))
		expect(bar()).toBe(first) // same element: nothing was rebuilt, so the entrance animation does not replay
		tick(1000)
		const after = Number(bar().getAttribute('height'))
		expect(during).toBeGreaterThan(before)
		expect(during).toBeLessThan(after)
	})

	it('BarChart (stacked, negative values) animates too', () => {
		const { container, rerender } = render(
			<BarChart
				stacked
				labels={labels}
				series={[
					{ name: 'S', values: [5, -5] },
					{ name: 'T', values: [5, -5] },
				]}
			/>
		)
		rerender(
			<BarChart
				stacked
				labels={labels}
				series={[
					{ name: 'S', values: [8, -2] },
					{ name: 'T', values: [5, -5] },
				]}
			/>
		)
		tick(0)
		tick(1000)
		expect(container.querySelectorAll('rect.xd-chart-bar')).toHaveLength(4)
	})

	it('LineChart: points and the line move to the new data', () => {
		const three = ['a', 'b', 'c']
		const { container, rerender } = render(
			<LineChart area labels={three} series={[{ name: 'S', values: [10, 40, 20] }]} />
		)
		const point = () => container.querySelectorAll('circle')[2]
		const line = container.querySelector('polyline')
		const before = Number(point().getAttribute('cy'))
		rerender(<LineChart area labels={three} series={[{ name: 'S', values: [10, 40, 35] }]} />)
		tick(0)
		tick(120)
		const during = Number(point().getAttribute('cy'))
		tick(1000)
		const after = Number(point().getAttribute('cy'))
		expect(container.querySelector('polyline')).toBe(line) // same element: nothing was rebuilt
		expect(during).toBeLessThan(before) // a higher value is further up: smaller y
		expect(after).toBeLessThan(during)
	})

	it('LineChart: smooth lines and a growing number of points snap instead of gliding', () => {
		const { container, rerender } = render(
			<LineChart smooth labels={labels} series={[{ name: 'S', values: [1, 2] }]} />
		)
		rerender(<LineChart smooth labels={['a', 'b', 'c']} series={[{ name: 'S', values: [1, 2, 3] }]} />)
		expect(container.querySelectorAll('circle')).toHaveLength(3)
		expect(frames.size).toBe(0)
	})

	it('PieChart: slices swing to their new size while labels keep the real values', () => {
		const data = value => [
			{ label: 'A', value },
			{ label: 'B', value: 50 },
		]
		const { container, rerender } = render(<PieChart data={data(50)} />)
		const first = () => container.querySelectorAll('path')[0].getAttribute('d')
		const before = first()
		rerender(<PieChart data={data(150)} />)
		tick(0)
		tick(100)
		const during = first()
		expect(document.body.textContent).toContain('A: 150 (75%)')
		tick(1000)
		const after = first()
		expect(during).not.toBe(before)
		expect(during).not.toBe(after)
		expect(screen.getAllByText(/A: 150 \(75%\)/).length).toBeGreaterThan(0)
	})

	it('PieChart: a slice appearing or disappearing, and an all-zero chart, do not break', () => {
		const { container, rerender } = render(
			<PieChart
				data={[
					{ label: 'A', value: 1 },
					{ label: 'B', value: 0 },
				]}
			/>
		)
		expect(container.querySelectorAll('path')).toHaveLength(1)
		rerender(
			<PieChart
				data={[
					{ label: 'A', value: 1 },
					{ label: 'B', value: 1 },
					{ label: 'C', value: 1 },
				]}
			/>
		)
		expect(container.querySelectorAll('path')).toHaveLength(3)
		rerender(<PieChart data={[{ label: 'A', value: 0 }]} />)
		expect(container.querySelectorAll('path')).toHaveLength(0)
	})

	it('animate={false} updates at once, with nothing scheduled', () => {
		const { container, rerender } = render(
			<BarChart animate={false} labels={labels} series={[{ name: 'S', values: [10, 40] }]} />
		)
		const before = Number(container.querySelectorAll('rect')[0].getAttribute('height'))
		rerender(<BarChart animate={false} labels={labels} series={[{ name: 'S', values: [30, 40] }]} />)
		expect(frames.size).toBe(0)
		expect(Number(container.querySelectorAll('rect')[0].getAttribute('height'))).toBeGreaterThan(before)
	})
})
