import { AxesFrame, Legend, MARGIN, legendItems, useChartWidth, yScale } from './charts/ChartFrame'
import { colorFor, niceScale } from './charts/chartUtils'
import useTween from './charts/useTween'

/**
 * Bar chart. `labels` names the categories; `series: [{ name, values, color? }]` has one value per label.
 * Multiple series are grouped side by side, or stacked with `stacked`. The bars grow from the baseline, one category
 * after another; when the data changes later they glide to their new height instead of redrawing (`animate={false}`
 * turns all of that off; reduced-motion users never see it).
 */
const BarChart = ({
	labels,
	series,
	height = 300,
	stacked = false,
	animate = true,
	label = 'Bar chart',
	legend = true,
	className = '',
}) => {
	const [ref, width] = useChartWidth()
	const totals = labels.map((_, i) => series.reduce((sum, s) => sum + s.values[i], 0))
	const max = stacked ? Math.max(...totals) : Math.max(...series.flatMap(s => s.values))
	const min = stacked ? 0 : Math.min(...series.flatMap(s => s.values))
	const scale = niceScale(min, max)

	const plotLeft = MARGIN.left
	const plotWidth = width - MARGIN.right - MARGIN.left
	const band = plotWidth / labels.length
	const groupWidth = band * 0.7
	const barWidth = stacked ? groupWidth : groupWidth / series.length
	const xPositions = labels.map((_, i) => plotLeft + band * i + band / 2)

	// Every bar's top and height in pixels, tweened when the data changes (the chart size snaps, never lags)
	const toY = yScale(height, scale)
	const zero = toY(Math.max(scale.min, 0))
	const geometry = labels.flatMap((_, i) => {
		let stackTop = zero
		return series.flatMap(s => {
			const top = toY(s.values[i])
			const h = Math.abs(zero - top)
			if (!stacked) return [Math.min(top, zero), h]
			stackTop -= h
			return [stackTop, h]
		})
	})
	const tweened = useTween(geometry, { enabled: animate, snapKey: `${width}x${height}` })

	return (
		<div ref={ref} className={className}>
			<AxesFrame
				width={width}
				height={height}
				scale={scale}
				labels={labels}
				xPositions={xPositions}
				label={label}
				legend={legend && series.length > 1 ? <Legend items={legendItems(series)} /> : null}
			>
				{() =>
					labels.map((name, i) => {
						const start = plotLeft + band * i + (band - groupWidth) / 2
						return (
							<g key={`${name}-${i}`}>
								{series.map((s, si) => {
									const v = s.values[i]
									const at = (i * series.length + si) * 2
									return (
										<rect
											key={s.name}
											x={start + (stacked ? 0 : barWidth * si) + 1}
											y={tweened[at]}
											width={Math.max(barWidth - 2, 1)}
											height={tweened[at + 1]}
											fill={colorFor(s, si)}
											className={animate ? 'xd-chart-bar' : undefined}
											style={
												animate
													? { transformOrigin: v < 0 ? 'top' : 'bottom', '--xd-delay': `${i * 0.05}s` }
													: undefined
											}
										>
											<title>{`${s.name}, ${name}: ${v}`}</title>
										</rect>
									)
								})}
							</g>
						)
					})
				}
			</AxesFrame>
		</div>
	)
}

export default BarChart
