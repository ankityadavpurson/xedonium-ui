import { useState } from 'react'
import { Markdown, RichTextEditor } from 'xedonium'

// `format="markdown"` edits Markdown text instead of HTML: what you type shows formatted, `onChange` gives the Markdown.
// Markdown has no underline, colors or alignment, so those buttons are left out.
export default function Demo() {
	const [source, setSource] = useState(
		'## Release notes\n\n- **Faster** search\n- A new *dark* theme\n\nRead more in the [docs](https://example.com).'
	)

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<RichTextEditor label="Editor" format="markdown" value={source} onChange={setSource} minHeight="14rem" />
			<div className="flex flex-col gap-1.5">
				<span className="text-xs font-semibold uppercase tracking-widest text-app-muted">Markdown</span>
				<pre className="m-0 min-h-24 overflow-auto whitespace-pre-wrap border border-app-border bg-app-card p-3 text-xs text-app-text">
					{source}
				</pre>
				<span className="mt-2 text-xs font-semibold uppercase tracking-widest text-app-muted">Rendered</span>
				<div className="border border-app-border p-3">
					<Markdown>{source}</Markdown>
				</div>
			</div>
		</div>
	)
}
