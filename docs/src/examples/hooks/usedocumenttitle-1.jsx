import { useEffect, useRef, useState } from 'react'
import { Field, useDocumentTitle } from 'xedonium'

// The browser tab title follows the field. (The demo puts the page's own title back when it goes away.)
export default function Demo() {
	const [title, setTitle] = useState('Settings')
	const original = useRef(document.title)
	useDocumentTitle(title, 'My App')
	useEffect(() => () => void (document.title = original.current), [])

	return (
		<div className="flex flex-col gap-3">
			<Field label="Page title" value={title} onChange={setTitle} />
			<p className="m-0 text-sm text-app-muted">
				The tab now reads: <strong className="text-app-text">{[title, 'My App'].filter(Boolean).join(' · ')}</strong>
			</p>
		</div>
	)
}
