import { useEffect, useState } from 'react'
import { Button, CommandPalette } from 'xedonium'

const ALL = [
	{ key: 'a', label: 'Alpha release notes', group: 'Docs' },
	{ key: 'b', label: 'Alpha API reference', group: 'Docs' },
	{ key: 'c', label: 'Alpha team', group: 'People' },
	{ key: 'd', label: 'Beta program', group: 'Docs' },
]

// Async search: `onQueryChange` fetches, `loading` shows the busy row, `highlight` marks the match.
// Results are not filtered again by the palette, because `onQueryChange` is set.
export default function Demo() {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState([])

	useEffect(() => {
		if (!query.trim()) {
			setResults([])
			return undefined
		}
		setLoading(true)
		const timer = setTimeout(() => {
			setResults(ALL.filter(item => item.label.toLowerCase().includes(query.trim().toLowerCase())))
			setLoading(false)
		}, 400)
		return () => clearTimeout(timer)
	}, [query])

	return (
		<>
			<Button onClick={() => setOpen(true)}>Search</Button>
			<CommandPalette
				open={open}
				onClose={() => setOpen(false)}
				commands={results}
				onQueryChange={setQuery}
				loading={loading}
				highlight
				placeholder="Search docs and people…"
				empty="Type to search"
			/>
		</>
	)
}
