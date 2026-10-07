// Shared helpers for the SVG charts. Colors: first series follows the theme, the rest are fixed accents.
export const PALETTE = [
	'rgb(var(--color-app-strong))',
	'#3b82f6',
	'#10b981',
	'#f59e0b',
	'#ef4444',
	'#8b5cf6',
	'#06b6d4',
	'#ec4899',
]

export const colorFor = (series: { color?: string }, index: number) => series.color ?? PALETTE[index % PALETTE.length]

// Round the axis max up to a "nice" number and return evenly spaced ticks from 0 (or min) to it
export const niceScale = (min: number, max: number, tickCount = 5) => {
	const lo = Math.min(0, min)
	const hi = max <= lo ? lo + 1 : max
	const rawStep = (hi - lo) / (tickCount - 1)
	const magnitude = 10 ** Math.floor(Math.log10(rawStep))
	const normalized = rawStep / magnitude
	const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude
	const niceMin = Math.floor(lo / step) * step
	const niceMax = Math.ceil(hi / step) * step
	const ticks: number[] = []
	for (let v = niceMin; v <= niceMax + step / 2; v += step) ticks.push(Number(v.toPrecision(12)))
	return { min: niceMin, max: niceMax, ticks }
}

export const formatTick = (value: number) =>
	new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value)

const round = (n: number) => Number(n.toFixed(2))

/**
 * SVG path through `points` ([x, y] pairs, x increasing) as a smooth curve: a monotone cubic spline, so the curve
 * passes through every point and never overshoots between them (a dip below a data point or past the axis is
 * impossible, unlike a plain Catmull-Rom curve). Two points give a straight line, one a lone moveto.
 */
export const smoothPath = (points: [number, number][]) => {
	const n = points.length
	if (n === 0) return ''
	const move = `M${round(points[0][0])},${round(points[0][1])}`
	if (n === 1) return move
	if (n === 2) return `${move} L${round(points[1][0])},${round(points[1][1])}`

	const dx: number[] = []
	const slope: number[] = []
	for (let i = 0; i < n - 1; i++) {
		dx.push(points[i + 1][0] - points[i][0])
		slope.push((points[i + 1][1] - points[i][1]) / dx[i])
	}
	// tangent at each point: 0 at a local extreme, otherwise a weighted harmonic mean of the neighbouring slopes
	const tangent = [slope[0]]
	for (let i = 1; i < n - 1; i++) {
		tangent.push(
			slope[i - 1] * slope[i] <= 0
				? 0
				: (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / slope[i - 1] + (dx[i] + 2 * dx[i - 1]) / slope[i])
		)
	}
	tangent.push(slope[n - 2])

	let d = move
	for (let i = 0; i < n - 1; i++) {
		const [x0, y0] = points[i]
		const [x1, y1] = points[i + 1]
		const third = dx[i] / 3
		d += ` C${round(x0 + third)},${round(y0 + tangent[i] * third)} ${round(x1 - third)},${round(y1 - tangent[i + 1] * third)} ${round(x1)},${round(y1)}`
	}
	return d
}
