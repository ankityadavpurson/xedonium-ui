import { useState } from 'react'
import { CodeDisplay, RichTextEditor } from 'xedonium'

// The editor reports HTML (always sanitized) while you type. Try the toolbar, Ctrl+B / I / U / K and Ctrl+Z / Y.
export default function Demo() {
	const [html, setHtml] = useState(
		'<h2>Gru plans</h2><p>Select some text and use the toolbar: <strong>bold</strong>, <em>italic</em>, <a href="https://example.com">links</a>, lists, quotes, tables and more.</p><ul><li>Buy bananas</li><li>Build the freeze ray</li><li>Steal the moon</li></ul>'
	)

	return (
		<div className="flex flex-col gap-4">
			<RichTextEditor
				label="Plans"
				value={html}
				onChange={setHtml}
				placeholder="Start writing..."
				helperText="Edits are sanitized: scripts and unsafe links never get in."
			/>
			<CodeDisplay code={html || '(empty)'} />
		</div>
	)
}
