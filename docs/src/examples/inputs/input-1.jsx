import { useState } from 'react'
import { Input } from 'xedonium'

export default function Demo() {
	const [text, setText] = useState('')
	return (
		<div className="max-w-sm">
			<Input value={text} onChange={setText} placeholder="Bare Input" aria-label="Bare input" />
		</div>
	)
}
