import { colorFor, formatTick } from './chartUtils'

export const WIDTH = 600
export const MARGIN = { top: 12, right: 16, bottom: 28, left: 44 }

export const Legend = ({ items }) => (
	<ul className="m-0 mt-2 flex list-none flex-wrap justify-center gap-x-4 gap-y-1 p-0 text-xs text-app-muted">
		{items.map(item => (
			<li key={item.name} className="flex items-center gap-1.5">
				<span aria-hidden="true" className="inline-block h-2.5 w-2.5" style={{ background: item.color }} />
				{item.name}
			</li>
		))}
	</ul>
)

// Axes + gridlines shared by Line / Area / Bar. `children` receives nothing; draw inside the plot area via the same margins.
export const AxesFrame = ({ height, scale, labels, xPositions, label, children, legend }) => {
	const plotBottom = height - MARGIN.bottom
	const plotHeight = plotBottom - MARGIN.top
	const y = value => MARGIN.top + plotHeight * (1 - (value - scale.min) / (scale.max - scale.min))
	return (
		<figure className="m-0">
			<svg
				role="img"
				aria-label={label}
				viewBox={`0 0 ${WIDTH} ${height}`}
				className="block h-auto w-full text-app-muted"
				fontFamily="inherit"
			>
				{scale.ticks.map(tick => (
					<g key={tick}>
						<line
							x1={MARGIN.left}
							x2={WIDTH - MARGIN.right}
							y1={y(tick)}
							y2={y(tick)}
							stroke="rgb(var(--color-app-border))"
							strokeWidth="1"
							strokeDasharray={tick === scale.min ? undefined : '3 3'}
						/>
						<text x={MARGIN.left - 6} y={y(tick)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="currentColor">
							{formatTick(tick)}
						</text>
					</g>
				))}
				{labels.map((text, i) => (
					<text
						key={`${text}-${i}`}
						x={xPositions[i]}
						y={plotBottom + 16}
						textAnchor="middle"
						fontSize="11"
						fill="currentColor"
					>
						{text}
					</text>
				))}
				{children(y)}
			</svg>
			{legend}
		</figure>
	)
}

export const legendItems = series => series.map((s, i) => ({ name: s.name, color: colorFor(s, i) }))
