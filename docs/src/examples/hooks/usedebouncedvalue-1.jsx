import { useState } from 'react'
import { useDebouncedValue } from 'xedonium'

export default function Demo() {
	const [text, setText] = useState('')
	const trailing = useDebouncedValue(text, 600)
	const leading = useDebouncedValue(text, 600, { leading: true })
	const capped = useDebouncedValue(text, 600, { maxWait: 1500 })

	return (
		<div className="flex flex-col gap-3">
			<input
				aria-label="Type quickly"
				className="border border-app-border bg-app-bg px-3 py-2 text-sm text-app-text"
				value={text}
				onChange={event => setText(event.target.value)}
				placeholder="Keep typing…"
			/>
			<dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-app-muted">
				<dt>trailing (default)</dt>
				<dd className="m-0">{trailing || '—'}</dd>
				<dt>leading</dt>
				<dd className="m-0">{leading || '—'}</dd>
				<dt>maxWait 1.5 s</dt>
				<dd className="m-0">{capped || '—'}</dd>
			</dl>
		</div>
	)
}
