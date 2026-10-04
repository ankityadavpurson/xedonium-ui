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

export const colorFor = (series, index) => series.color ?? PALETTE[index % PALETTE.length]

// Round the axis max up to a "nice" number and return evenly spaced ticks from 0 (or min) to it
export const niceScale = (min, max, tickCount = 5) => {
	const lo = Math.min(0, min)
	const hi = max <= lo ? lo + 1 : max
	const rawStep = (hi - lo) / (tickCount - 1)
	const magnitude = 10 ** Math.floor(Math.log10(rawStep))
	const normalized = rawStep / magnitude
	const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude
	const niceMin = Math.floor(lo / step) * step
	const niceMax = Math.ceil(hi / step) * step
	const ticks = []
	for (let v = niceMin; v <= niceMax + step / 2; v += step) ticks.push(Number(v.toPrecision(12)))
	return { min: niceMin, max: niceMax, ticks }
}

export const formatTick = value =>
	new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
