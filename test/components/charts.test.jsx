import { act, render, screen } from '@testing-library/react'
import BarChart from '../../src/components/BarChart'
import LineChart from '../../src/components/LineChart'
import PieChart from '../../src/components/PieChart'
import { Legend, useChartWidth } from '../../src/components/charts/ChartFrame'
import { PALETTE, colorFor, formatTick, niceScale } from '../../src/components/charts/chartUtils'

describe('chartUtils', () => {
	it('niceScale rounds up to nice ticks', () => {
		const s = niceScale(0, 97)
		expect(s.min).toBe(0)
		expect(s.max).toBe(100)
		expect(s.ticks[0]).toBe(0)
		expect(s.ticks.at(-1)).toBe(100)
	})
	it('niceScale handles negatives and flat data', () => {
		const neg = niceScale(-30, 10)
		expect(neg.min).toBeLessThan(0)
		expect(niceScale(0, 0).max).toBeGreaterThan(0)
		expect(niceScale(5, 5).max).toBeGreaterThanOrEqual(5)
		for (const [lo, hi] of [
			[0, 1.5],
			[0, 3],
			[0, 9],
			[0, 15],
		]) {
			expect(niceScale(lo, hi).max).toBeGreaterThanOrEqual(hi)
		}
	})
	it('colorFor prefers explicit colours and cycles the palette', () => {
		expect(colorFor({ color: 'red' }, 0)).toBe('red')
		expect(colorFor({}, 1)).toBe(PALETTE[1])
		expect(colorFor({}, PALETTE.length)).toBe(PALETTE[0])
	})
	it('formatTick compacts numbers', () => {
		expect(formatTick(1500)).toMatch(/1\.5K|1,5/)
		expect(formatTick(5)).toBe('5')
	})
})

describe('Legend', () => {
	it('lists items', () => {
		render(<Legend items={[{ name: 'A', color: 'red' }]} />)
		expect(screen.getByText('A')).toBeInTheDocument()
	})
})

describe('useChartWidth', () => {
	it('tracks the container width via ResizeObserver', () => {
		let callback
		const disconnect = vi.fn()
		globalThis.ResizeObserver = class {
			constructor(cb) {
				callback = cb
			}
			observe() {}
			disconnect = disconnect
		}
		const Probe = () => {
			const [ref, width] = useChartWidth()
			return (
				<div ref={ref} data-testid="p">
					{width}
				</div>
			)
		}
		const { unmount } = render(<Probe />)
		expect(screen.getByTestId('p')).toHaveTextContent('600')
		act(() => callback([{ contentRect: { width: 321.4 } }]))
		expect(screen.getByTestId('p')).toHaveTextContent('321')
		act(() => callback([{ contentRect: { width: 0 } }]))
		expect(screen.getByTestId('p')).toHaveTextContent('321')
		unmount()
		expect(disconnect).toHaveBeenCalled()
	})

	it('falls back to the default width without ResizeObserver', () => {
		const original = globalThis.ResizeObserver
		delete globalThis.ResizeObserver
		const Probe = () => {
			const [ref, width] = useChartWidth()
			return (
				<div ref={ref} data-testid="p">
					{width}
				</div>
			)
		}
		render(<Probe />)
		expect(screen.getByTestId('p')).toHaveTextContent('600')
		globalThis.ResizeObserver = original
	})
})

describe('LineChart', () => {
	const series = [
		{ name: 'A', values: [1, 4, 2] },
		{ name: 'B', values: [3, 1, 5], color: 'red' },
	]
	it('draws lines, points, labels and a legend', () => {
		const { container } = render(<LineChart labels={['x', 'y', 'z']} series={series} />)
		expect(screen.getByRole('img', { name: 'Line chart' })).toBeInTheDocument()
		expect(container.querySelectorAll('polyline')).toHaveLength(2)
		expect(container.querySelectorAll('circle')).toHaveLength(6)
		expect(container.querySelector('polygon')).toBeNull()
		expect(screen.getByText('B')).toBeInTheDocument()
	})
	it('fills area, hides legend, handles a single label and negative values', () => {
		const { container, rerender } = render(<LineChart area legend={false} labels={['x']} series={[series[0]]} />)
		expect(container.querySelector('polygon')).toBeInTheDocument()
		expect(container.querySelector('ul')).toBeNull()
		rerender(<LineChart labels={['x', 'y']} series={[{ name: 'N', values: [-5, 5] }]} area />)
		expect(container.querySelector('polygon')).toBeInTheDocument()
		rerender(
			<LineChart
				labels={['x', 'y']}
				series={series.map(s => ({ ...s, values: s.values.slice(0, 2) }))}
				legend={false}
			/>
		)
		expect(container.querySelector('ul')).toBeNull()
	})
})

describe('BarChart', () => {
	const series = [
		{ name: 'A', values: [1, 4, 2] },
		{ name: 'B', values: [3, -1, 5] },
	]
	it('groups bars side by side', () => {
		const { container } = render(<BarChart labels={['x', 'y', 'z']} series={series} />)
		expect(container.querySelectorAll('rect')).toHaveLength(6)
		expect(screen.getByRole('img', { name: 'Bar chart' })).toBeInTheDocument()
		expect(screen.getByText('A')).toBeInTheDocument()
	})
	it('stacks bars and can hide the legend', () => {
		const { container } = render(<BarChart stacked legend={false} labels={['x', 'y', 'z']} series={series} />)
		expect(container.querySelectorAll('rect')).toHaveLength(6)
		expect(container.querySelector('ul')).toBeNull()
	})
	it('works with a single series', () => {
		const { container } = render(<BarChart labels={['x']} series={[{ name: 'A', values: [3] }]} />)
		expect(container.querySelectorAll('rect')).toHaveLength(1)
		expect(container.querySelector('ul')).toBeNull()
	})
})

describe('PieChart', () => {
	it('draws a slice per positive value and a legend', () => {
		const { container } = render(
			<PieChart
				data={[
					{ label: 'A', value: 1 },
					{ label: 'B', value: 2, color: 'red' },
					{ label: 'C', value: 0 },
					{ label: 'D', value: 6 },
				]}
			/>
		)
		expect(container.querySelectorAll('path')).toHaveLength(3)
		expect(screen.queryByText('C')).toBeNull()
	})
	it('draws a donut with centre text', () => {
		const { container } = render(
			<PieChart
				donut
				center="42"
				label="Share"
				data={[
					{ label: 'A', value: 1 },
					{ label: 'B', value: 1 },
				]}
			/>
		)
		expect(screen.getByRole('img', { name: 'Share' })).toBeInTheDocument()
		expect(container.querySelector('text')).toHaveTextContent('42')
	})
	it('omits the centre when not a donut and splits a full circle', () => {
		const { container } = render(<PieChart center="no" data={[{ label: 'Only', value: 5 }]} />)
		expect(container.querySelector('text')).toBeNull()
		expect(container.querySelector('path').getAttribute('d').split('M').length).toBeGreaterThan(2)
	})
	it('draws a full-circle donut and a large arc', () => {
		const { container } = render(
			<PieChart
				donut
				data={[
					{ label: 'Big', value: 9 },
					{ label: 'Small', value: 1 },
				]}
			/>
		)
		expect(container.querySelectorAll('path')).toHaveLength(2)
		const full = render(<PieChart donut data={[{ label: 'Only', value: 5 }]} />)
		expect(full.container.querySelector('path').getAttribute('d')).toContain('A')
	})
})
