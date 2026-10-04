import { AxesFrame, Legend, MARGIN, legendItems, useChartWidth } from './charts/ChartFrame'
import { colorFor, niceScale } from './charts/chartUtils'

/**
 * Bar chart. `labels` names the categories; `series: [{ name, values, color? }]` has one value per label.
 * Multiple series are grouped side by side, or stacked with `stacked`.
 */
const BarChart = ({
	labels,
	series,
	height = 300,
	stacked = false,
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
				{y => {
					const zero = y(Math.max(scale.min, 0))
					return labels.map((name, i) => {
						const start = plotLeft + band * i + (band - groupWidth) / 2
						let stackTop = zero
						return (
							<g key={`${name}-${i}`}>
								{series.map((s, si) => {
									const v = s.values[i]
									const top = y(v)
									const h = Math.abs(zero - top)
									let rectY = Math.min(top, zero)
									const rectX = start + (stacked ? 0 : barWidth * si)
									if (stacked) {
										rectY = stackTop - h
										stackTop = rectY
									}
									return (
										<rect
											key={s.name}
											x={rectX + 1}
											y={rectY}
											width={Math.max(barWidth - 2, 1)}
											height={h}
											fill={colorFor(s, si)}
										>
											<title>{`${s.name}, ${name}: ${v}`}</title>
										</rect>
									)
								})}
							</g>
						)
					})
				}}
			</AxesFrame>
		</div>
	)
}

export default BarChart
