import Tooltip from './Tooltip'
import { Legend } from './charts/ChartFrame'
import { colorFor } from './charts/chartUtils'
import useTween from './charts/useTween'

const SIZE = 240
const R = 100

const polar = (angle, radius) => [SIZE / 2 + radius * Math.sin(angle), SIZE / 2 - radius * Math.cos(angle)]

const slicePath = (start, end, inner) => {
	// A full circle can't be drawn as one arc; split it in two halves
	if (end - start >= Math.PI * 2 - 1e-6) {
		const mid = start + Math.PI
		return `${slicePath(start, mid, inner)} ${slicePath(mid, start + Math.PI * 2 - 1e-4, inner)}`
	}
	const large = end - start > Math.PI ? 1 : 0
	const [x1, y1] = polar(start, R)
	const [x2, y2] = polar(end, R)
	if (!inner) return `M${SIZE / 2},${SIZE / 2} L${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} Z`
	const [x3, y3] = polar(end, inner)
	const [x4, y4] = polar(start, inner)
	return `M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 ${large} 0 ${x4},${y4} Z`
}

const detail = (slice, total) => `${slice.label}: ${slice.value} (${Math.round((slice.value / total) * 100)}%)`

/**
 * Pie chart (or donut with `donut`). `data: [{ label, value, color? }]`; `center` is shown in the donut hole.
 * Hovering a slice shows its label, value and share in a Tooltip that follows the mouse; screen readers get the same
 * figures as a hidden list. The slices pop in one after another; when the data changes later they swing to their new
 * size instead of redrawing (`animate={false}` turns all of that off; reduced-motion users never see it). */
const PieChart = ({ data, donut = false, center, label = 'Pie chart', animate = true, className = '' }) => {
	const total = data.reduce((sum, d) => sum + d.value, 0)
	// The slice angles follow the tweened values; labels, tooltips and the legend use the real ones
	const shown = useTween(
		data.map(d => d.value),
		{ enabled: animate }
	)
	const shownTotal = shown.reduce((sum, value) => sum + value, 0) || 1
	let angle = 0
	const slices = data
		.map((d, i) => {
			const start = angle
			angle += (shown[i] / shownTotal) * Math.PI * 2
			return { ...d, start, end: angle }
		})
		.filter(d => d.value > 0)
		.map((d, i) => ({ ...d, color: colorFor(d, i) }))

	return (
		<figure className={`m-0 ${className}`}>
			<svg
				role="img"
				aria-label={label}
				viewBox={`0 0 ${SIZE} ${SIZE}`}
				className="mx-auto block h-auto w-full max-w-xs"
			>
				{slices.map((slice, index) => (
					<Tooltip as="g" key={slice.label} text={detail(slice, total)} placement="top" followPointer>
						<path
							d={slicePath(slice.start, slice.end, donut ? R * 0.6 : 0)}
							fill={slice.color}
							stroke="rgb(var(--color-app-card))"
							strokeWidth="2"
							// round joins: the default miter join spikes out past the centre where the slices' sharp corners meet
							strokeLinejoin="round"
							className={animate ? 'xd-chart-slice' : undefined}
							style={animate ? { '--xd-delay': `${index * 0.08}s` } : undefined}
						/>
					</Tooltip>
				))}
				{donut && center && (
					<text
						x={SIZE / 2}
						y={SIZE / 2}
						textAnchor="middle"
						dominantBaseline="middle"
						fontSize="20"
						fontWeight="600"
						fill="rgb(var(--color-app-text))"
						className={animate ? 'xd-chart-label' : undefined}
					>
						{center}
					</text>
				)}
			</svg>
			<ul className="sr-only">
				{slices.map(slice => (
					<li key={slice.label}>{detail(slice, total)}</li>
				))}
			</ul>
			<Legend items={slices.map(s => ({ name: s.label, color: s.color }))} />
		</figure>
	)
}

export default PieChart
