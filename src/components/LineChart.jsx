import { AxesFrame, Legend, MARGIN, legendItems, useChartWidth } from './charts/ChartFrame'
import { colorFor, niceScale } from './charts/chartUtils'

/**
 * Line chart. `labels` names the x positions; `series: [{ name, values, color? }]` has one value per label.
 * `area` fills under each line (see AreaChart). Hover a point for its value.
 */
const LineChart = ({
	labels,
	series,
	height = 300,
	area = false,
	label = 'Line chart',
	legend = true,
	className = '',
}) => {
	const [ref, width] = useChartWidth()
	const all = series.flatMap(s => s.values)
	const scale = niceScale(Math.min(...all), Math.max(...all))
	const plotLeft = MARGIN.left
	const plotRight = width - MARGIN.right
	const x = i =>
		labels.length === 1 ? (plotLeft + plotRight) / 2 : plotLeft + ((plotRight - plotLeft) * i) / (labels.length - 1)
	const xPositions = labels.map((_, i) => x(i))

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
					const baseline = y(Math.max(scale.min, 0))
					return series.map((s, si) => {
						const color = colorFor(s, si)
						const points = s.values.map((v, i) => `${x(i)},${y(v)}`)
						return (
							<g key={s.name}>
								{area && (
									<polygon
										points={`${x(0)},${baseline} ${points.join(' ')} ${x(s.values.length - 1)},${baseline}`}
										fill={color}
										opacity="0.18"
									/>
								)}
								<polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
								{s.values.map((v, i) => (
									<circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill={color}>
										<title>{`${s.name}, ${labels[i]}: ${v}`}</title>
									</circle>
								))}
							</g>
						)
					})
				}}
			</AxesFrame>
		</div>
	)
}

export default LineChart
