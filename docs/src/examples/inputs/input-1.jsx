import { useState } from 'react'
import { Input, SearchIcon } from 'xedonium'

export default function Demo() {
	const [text, setText] = useState('')
	const [query, setQuery] = useState('')
	return (
		<div className="flex max-w-sm flex-col gap-3">
			<Input value={text} onChange={setText} placeholder="Bare Input" aria-label="Bare input" />
			<Input
				value={query}
				onChange={setQuery}
				placeholder="Search bananas"
				aria-label="Search bananas"
				startAdornment={<SearchIcon />}
				endAdornment={
					query && (
						<button type="button" aria-label="Clear" onClick={() => setQuery('')}>
							×
						</button>
					)
				}
			/>
		</div>
	)
}
