import type { CSSProperties } from 'react'
import { AxesFrame, Legend, MARGIN, legendItems, useChartWidth, yScale, type ChartSeries } from './charts/ChartFrame'
import { colorFor, niceScale, smoothPath } from './charts/chartUtils'
import useTween from './charts/useTween'

export interface LineChartProps {
	/** Names of the x positions. */
	labels: string[]
	series: ChartSeries[]
	/** Height in px. */
	height?: number
	/** Fill under each line (see AreaChart). */
	area?: boolean
	/** Curved lines instead of straight segments. */
	smooth?: boolean
	/** `false` turns all animation off. */
	animate?: boolean
	/** Accessible name of the chart. */
	label?: string
	/** Show the legend when there are several series (default true). */
	legend?: boolean
	className?: string
}

/**
 * Line chart. `labels` names the x positions; `series: [{ name, values, color? }]` has one value per label.
 * `area` fills under each line (see AreaChart). `smooth` draws curves instead of straight segments (they still pass
 * through every point and never overshoot it). The lines draw in, the area fades in and the points pop in; when the
 * data changes later the lines glide to their new positions instead of redrawing (`animate={false}` turns all of
 * that off; reduced-motion users never see it). Hover a point for its value.
 */
const LineChart = ({
	labels,
	series,
	height = 300,
	area = false,
	smooth = false,
	animate = true,
	label = 'Line chart',
	legend = true,
	className = '',
}: LineChartProps) => {
	const [ref, width] = useChartWidth()
	const all = series.flatMap(s => s.values)
	const scale = niceScale(Math.min(...all), Math.max(...all))
	const plotLeft = MARGIN.left
	const plotRight = width - MARGIN.right
	const x = (i: number) =>
		labels.length === 1 ? (plotLeft + plotRight) / 2 : plotLeft + ((plotRight - plotLeft) * i) / (labels.length - 1)
	const xPositions = labels.map((_, i) => x(i))

	// Pixel heights of the baseline and every point, tweened when the data changes (the chart size snaps, never lags)
	const toY = yScale(height, scale)
	const rows = [toY(Math.max(scale.min, 0)), ...series.flatMap(s => s.values.map(toY))]
	const tweened = useTween(rows, { enabled: animate, snapKey: `${width}x${height}` })
	let offset = 1
	const seriesY = series.map(s => {
		const ys = tweened.slice(offset, offset + s.values.length)
		offset += s.values.length
		return ys
	})

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
				{() => {
					const baseline = tweened[0]
					return series.map((s, si) => {
						const color = colorFor(s, si)
						const coords = seriesY[si].map((py, i): [number, number] => [x(i), py])
						const points = coords.map(point => point.join(',')).join(' ')
						const first = x(0)
						const last = x(s.values.length - 1)
						// straight segments keep the plain polyline / polygon; `smooth` swaps in a curved path
						const curve = smooth ? smoothPath(coords) : ''
						const lineProps = animate ? { pathLength: 1, className: 'xd-chart-line' } : {}
						const fillClass = animate ? 'xd-chart-fill' : undefined
						return (
							<g key={s.name}>
								{area &&
									(smooth ? (
										<path
											d={`${curve} L${last},${baseline} L${first},${baseline} Z`}
											fill={color}
											opacity="0.18"
											className={fillClass}
										/>
									) : (
										<polygon
											points={`${first},${baseline} ${points} ${last},${baseline}`}
											fill={color}
											opacity="0.18"
											className={fillClass}
										/>
									))}
								{smooth ? (
									<path
										d={curve}
										fill="none"
										stroke={color}
										strokeWidth="2"
										strokeLinejoin="round"
										strokeLinecap="round"
										{...lineProps}
									/>
								) : (
									<polyline
										points={points}
										fill="none"
										stroke={color}
										strokeWidth="2"
										strokeLinejoin="round"
										{...lineProps}
									/>
								)}
								{s.values.map((v, i) => (
									<circle
										key={i}
										cx={x(i)}
										cy={seriesY[si][i]}
										r="3.5"
										fill={color}
										className={animate ? 'xd-chart-point' : undefined}
										style={
											animate
												? ({ '--xd-delay': `${(0.9 * i) / Math.max(s.values.length - 1, 1)}s` } as CSSProperties)
												: undefined
										}
									>
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
