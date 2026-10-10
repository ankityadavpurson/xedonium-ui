import { useMediaQuery } from 'xedonium'

// Each value follows its query live: resize the window or change a system setting to see it flip.
const QUERIES = [
	['(min-width: 768px)', 'Wide screen (768px or more)'],
	['(prefers-color-scheme: dark)', 'System theme is dark'],
	['(prefers-reduced-motion: reduce)', 'Reduced motion requested'],
]

function Row({ query, label }) {
	const matches = useMediaQuery(query)
	return (
		<li className="flex items-center justify-between gap-4 border border-app-border px-3 py-2">
			<span>
				{label} <code className="text-xs text-app-muted">{query}</code>
			</span>
			<strong>{matches ? 'Yes' : 'No'}</strong>
		</li>
	)
}

export default function Demo() {
	return (
		<ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-app-text">
			{QUERIES.map(([query, label]) => (
				<Row key={query} query={query} label={label} />
			))}
		</ul>
	)
}
