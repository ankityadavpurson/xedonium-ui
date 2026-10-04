import { Legend } from './charts/ChartFrame'
import { colorFor } from './charts/chartUtils'

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

/** Pie chart (or donut with `donut`). `data: [{ label, value, color? }]`; `center` is shown in the donut hole. */
const PieChart = ({ data, donut = false, center, label = 'Pie chart', className = '' }) => {
	const total = data.reduce((sum, d) => sum + d.value, 0)
	let angle = 0
	const slices = data
		.filter(d => d.value > 0)
		.map((d, i) => {
			const start = angle
			angle += (d.value / total) * Math.PI * 2
			return { ...d, start, end: angle, color: colorFor(d, i) }
		})

	return (
		<figure className={`m-0 ${className}`}>
			<svg role="img" aria-label={label} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto block h-auto w-full max-w-xs">
				{slices.map(slice => (
					<path
						key={slice.label}
						d={slicePath(slice.start, slice.end, donut ? R * 0.6 : 0)}
						fill={slice.color}
						stroke="rgb(var(--color-app-card))"
						strokeWidth="2"
					>
						<title>{`${slice.label}: ${slice.value} (${Math.round((slice.value / total) * 100)}%)`}</title>
					</path>
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
					>
						{center}
					</text>
				)}
			</svg>
			<Legend items={slices.map(s => ({ name: s.label, color: s.color }))} />
		</figure>
	)
}

export default PieChart
