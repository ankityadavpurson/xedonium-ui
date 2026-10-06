import { act, fireEvent, render, screen } from '@testing-library/react'
import BarChart from '../../src/components/BarChart'
import AreaChart from '../../src/components/AreaChart'
import LineChart from '../../src/components/LineChart'
import PieChart from '../../src/components/PieChart'
import { smoothPath } from '../../src/components/charts/chartUtils'
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

describe('chart animation', () => {
	const labels = ['a', 'b', 'c']
	const series = [{ name: 'S', values: [3, 9, 6] }]

	it('animates a line chart: the line draws, the points pop, the area fades in', () => {
		const { container } = render(<AreaChart labels={labels} series={series} />)
		const line = container.querySelector('polyline')
		expect(line).toHaveClass('xd-chart-line')
		expect(line).toHaveAttribute('pathLength', '1')
		expect(container.querySelector('polygon')).toHaveClass('xd-chart-fill')
		const points = [...container.querySelectorAll('circle')]
		expect(points.every(p => p.classList.contains('xd-chart-point'))).toBe(true)
		expect(points.map(p => p.style.getPropertyValue('--xd-delay'))).toEqual(['0s', '0.45s', '0.9s'])
	})

	it('animates smooth lines the same way', () => {
		const { container } = render(<LineChart smooth area labels={labels} series={series} />)
		expect([...container.querySelectorAll('path')].filter(p => p.classList.contains('xd-chart-line'))).toHaveLength(1)
		expect([...container.querySelectorAll('path')].filter(p => p.classList.contains('xd-chart-fill'))).toHaveLength(1)
	})

	it('handles a single point without dividing by zero', () => {
		const { container } = render(<LineChart labels={['a']} series={[{ name: 'S', values: [3] }]} />)
		expect(container.querySelector('circle').style.getPropertyValue('--xd-delay')).toBe('0s')
	})

	it('grows bars from the baseline, staggered per category, and from the top for negative values', () => {
		const { container } = render(<BarChart labels={['a', 'b']} series={[{ name: 'S', values: [4, -2] }]} />)
		const bars = container.querySelectorAll('rect.xd-chart-bar')
		expect(bars).toHaveLength(2)
		expect(bars[0].style.transformOrigin).toBe('bottom')
		expect(bars[1].style.transformOrigin).toBe('top')
		expect(bars[1].style.getPropertyValue('--xd-delay')).toBe('0.05s')
	})

	it('pops pie slices in one after another and fades the donut label', () => {
		const { container } = render(
			<PieChart
				donut
				center="42"
				data={[
					{ label: 'A', value: 1 },
					{ label: 'B', value: 2 },
				]}
			/>
		)
		const slices = container.querySelectorAll('path.xd-chart-slice')
		expect(slices).toHaveLength(2)
		expect(slices[1].style.getPropertyValue('--xd-delay')).toBe('0.08s')
		expect(container.querySelector('text')).toHaveClass('xd-chart-label')
	})

	it('adds no animation classes with animate={false}', () => {
		const data = [{ label: 'A', value: 1 }]
		const { container } = render(
			<>
				<LineChart animate={false} area labels={labels} series={series} />
				<LineChart animate={false} smooth area labels={labels} series={series} />
				<BarChart animate={false} labels={labels} series={series} />
				<PieChart animate={false} donut center="1" data={data} />
			</>
		)
		expect(container.innerHTML).not.toMatch(/xd-chart-/)
		expect(container.querySelector('polyline')).not.toHaveAttribute('pathLength')
	})
})

describe('smooth lines', () => {
	const labels = ['a', 'b', 'c', 'd']
	const series = [{ name: 'S', values: [10, 40, 40, 5] }]

	it('draws a cubic curve per segment instead of straight lines', () => {
		const { container } = render(<LineChart smooth labels={labels} series={series} />)
		expect(container.querySelector('polyline')).toBeNull()
		const line = [...container.querySelectorAll('path')].find(p => p.getAttribute('fill') === 'none')
		expect(line.getAttribute('d').match(/C/g)).toHaveLength(3)
		expect(line.getAttribute('d')).not.toMatch(/L/)
	})

	it('keeps straight polyline / polygon segments by default', () => {
		const { container } = render(<AreaChart labels={labels} series={series} />)
		expect(container.querySelectorAll('polyline')).toHaveLength(1)
		expect(container.querySelectorAll('polygon')).toHaveLength(1)
		expect([...container.querySelectorAll('path')].some(p => p.getAttribute('fill') === 'none')).toBe(false)
	})

	it('closes the area under a smooth line down to the baseline', () => {
		const { container } = render(<AreaChart smooth labels={labels} series={series} />)
		const fill = [...container.querySelectorAll('path')].find(p => p.getAttribute('opacity') === '0.18')
		expect(fill.getAttribute('d')).toMatch(/C.* L[\d.]+,[\d.]+ L[\d.]+,[\d.]+ Z$/)
	})

	it('smoothPath handles empty, single and two-point lines', () => {
		expect(smoothPath([])).toBe('')
		expect(smoothPath([[5, 6]])).toBe('M5,6')
		expect(
			smoothPath([
				[0, 0],
				[10, 20],
			])
		).toBe('M0,0 L10,20')
	})

	it('smoothPath never overshoots between points (monotone), and flattens at extremes', () => {
		const pts = [
			[0, 100],
			[50, 20],
			[100, 20],
			[150, 100],
		]
		const d = smoothPath(pts)
		const ys = [...d.matchAll(/[CM]?(-?[\d.]+),(-?[\d.]+)/g)].map(m => Number(m[2]))
		expect(Math.min(...ys)).toBeGreaterThanOrEqual(20)
		expect(Math.max(...ys)).toBeLessThanOrEqual(100)
		// the flat top between the middle points has zero tangent: both control points stay at y=20
		expect(d).toContain('C')
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
	const data = [
		{ label: 'Chrome', value: 60 },
		{ label: 'Safari', value: 40 },
	]

	it('shows the slice details in a tooltip that follows the pointer, not a title', () => {
		const { container } = render(<PieChart data={data} />)
		expect(container.querySelector('title')).toBeNull()
		const slice = container.querySelectorAll('path')[0]
		fireEvent.mouseEnter(slice.parentElement, { clientX: 100, clientY: 120 })
		const tip = document.body.querySelector('.pointer-events-none.fixed')
		expect(tip).toHaveTextContent('Chrome: 60 (60%)')
		const before = tip.style.left
		fireEvent.mouseMove(slice.parentElement, { clientX: 220, clientY: 130 })
		expect(document.body.querySelector('.pointer-events-none.fixed').style.left).not.toBe('')
		expect(document.body.querySelector('.pointer-events-none.fixed')).toHaveTextContent('Chrome: 60 (60%)')
		expect(before).toBeDefined()
		fireEvent.mouseLeave(slice.parentElement)
		expect(document.body.querySelector('.pointer-events-none.fixed')).toBeNull()
		fireEvent.mouseEnter(container.querySelectorAll('path')[1].parentElement, { clientX: 10, clientY: 10 })
		expect(document.body.querySelector('.pointer-events-none.fixed')).toHaveTextContent('Safari: 40 (40%)')
	})

	it('gives screen readers the same figures as a hidden list', () => {
		const { container } = render(<PieChart data={data} />)
		const items = [...container.querySelectorAll('ul.sr-only li')].map(li => li.textContent)
		expect(items).toEqual(['Chrome: 60 (60%)', 'Safari: 40 (40%)'])
	})

	it('uses round joins so the slice outlines do not spike out of the centre', () => {
		const { container } = render(
			<PieChart
				data={[
					{ label: 'A', value: 1 },
					{ label: 'B', value: 1 },
					{ label: 'C', value: 1 },
				]}
			/>
		)
		for (const path of container.querySelectorAll('path')) expect(path).toHaveAttribute('stroke-linejoin', 'round')
	})
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
