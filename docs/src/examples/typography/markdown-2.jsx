import { useState } from 'react'
import { Markdown, TextArea } from 'xedonium'

const start = `## Live editor

Type **Markdown** here and see it rendered beside it.

- [x] bold, *italic*, \`code\`
- [ ] your own text

[Home](/) is an internal link, [Example](https://example.com) is external.

<script>alert('plain text, never run')</script>`

// Stands in for a router link (react-router: linkComponent={Link} linkProp="to")
const RouterLink = ({ to, children, ...rest }) => (
	<a href={`#${to}`} data-router-link {...rest}>
		{children}
	</a>
)

export default function Demo() {
	const [source, setSource] = useState(start)

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<TextArea label="Markdown" value={source} onChange={setSource} rows={12} />
			<div className="flex flex-col gap-1">
				<span className="text-xs font-semibold uppercase tracking-widest text-app-muted">Result</span>
				<div className="border border-app-border bg-app-card p-4">
					<Markdown linkComponent={RouterLink} linkProp="to" openLinksInNewTab>
						{source}
					</Markdown>
				</div>
			</div>
		</div>
	)
}
