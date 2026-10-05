import { Fragment } from 'react'
import { Link } from 'react-router-dom'

// Inline: `code`, **bold**, [text](href). Internal links (starting with "/") use the router.
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g

export const Code = ({ children }) => (
	<code className="border border-app-border bg-app-card px-1 py-0.5 text-[0.85em] text-app-text">{children}</code>
)

const renderInline = text =>
	text.split(INLINE).map((part, i) => {
		if (part.startsWith('`')) return <Code key={i}>{part.slice(1, -1)}</Code>
		if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
		const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
		if (link) {
			const [, label, href] = link
			const cls = 'underline underline-offset-2 hover:text-app-strong'
			return href.startsWith('/') ? (
				<Link key={i} to={href} className={cls}>
					{label}
				</Link>
			) : (
				<a key={i} href={href} className={cls}>
					{label}
				</a>
			)
		}
		return <Fragment key={i}>{part}</Fragment>
	})

/** Tiny Markdown subset: paragraphs, "- " lists, inline code / bold / links. */
const Markdown = ({ children, className = '' }) => {
	const blocks = children.split(/\n\s*\n/)
	return (
		<div className={`flex flex-col gap-3 text-sm leading-relaxed text-app-text ${className}`}>
			{blocks.map((block, i) => {
				const lines = block.split('\n')
				if (lines.every(line => line.startsWith('- '))) {
					return (
						<ul key={i} className="m-0 list-disc pl-5">
							{lines.map((line, j) => (
								<li key={j}>{renderInline(line.slice(2))}</li>
							))}
						</ul>
					)
				}
				return (
					<p key={i} className="m-0">
						{renderInline(lines.join(' '))}
					</p>
				)
			})}
		</div>
	)
}

export default Markdown
