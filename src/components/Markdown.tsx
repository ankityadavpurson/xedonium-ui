import { Fragment, useState, type ElementType, type ReactNode } from 'react'
import { inlineText, parseMarkdown, type Align, type Block, type Inline, type ListItem } from '../utils/markdown'
import CodeDisplay from './CodeDisplay'

export interface MarkdownProps {
	/** The Markdown source. */
	children?: string
	/** Swap in a router link for internal links, e.g. `linkComponent={Link} linkProp="to"` (as in TextLink). */
	linkComponent?: ElementType
	linkProp?: string
	/** Which links go through `linkComponent`. By default: paths starting with `/` (not `//`). */
	isInternalLink?: (href: string) => boolean
	/** Open external links in a new tab (they always get `rel="noopener noreferrer"`). */
	openLinksInNewTab?: boolean
	/** Give headings an `id` (their text as a slug) so `#anchor` links work (default true). */
	headingIds?: boolean
	className?: string
}

const HEADINGS = {
	1: 'text-2xl font-bold tracking-tight',
	2: 'text-xl font-semibold tracking-tight',
	3: 'text-lg font-semibold',
	4: 'text-base font-semibold',
	5: 'text-sm font-semibold',
	6: 'text-xs font-semibold uppercase tracking-widest text-app-muted',
}

const ALIGN: Record<Exclude<Align, null>, string> = { left: 'text-left', center: 'text-center', right: 'text-right' }

const LINK_CLASS = 'underline underline-offset-2 transition hover:text-app-strong'

const slugify = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.replace(/\s+/g, '-')

// An inline image: lazy, never wider than the text, and its alt text when it fails to load. (The Image component's
// fallback is a block box, which cannot sit inside a paragraph.)
const MarkdownImage = ({ src, alt, title }: { src: string; alt: string; title?: string }) => {
	const [failed, setFailed] = useState(false)
	if (failed) return <span className="text-app-muted">{alt}</span>
	return (
		<img
			src={src}
			alt={alt}
			title={title}
			loading="lazy"
			onError={() => setFailed(true)}
			className="inline-block h-auto max-w-full"
		/>
	)
}

const defaultInternal = (href: string) => href.startsWith('/') && !href.startsWith('//')

/**
 * Renders GitHub-style Markdown with the library's own components, without a Markdown dependency: headings,
 * paragraphs, bold / italic / strikethrough, links, images (lazy, with their alt text as the fallback), ordered, unordered and nested lists, task lists, quotes,
 * tables with alignment, rules and fenced code (shown with CodeDisplay, so it is colored by language and can be copied).
 *
 * It is safe for text you do not control: HTML in the source stays literal text, and links and images with unsafe URLs
 * (`javascript:`, `data:` ...) are shown as plain text. Links starting with `/` go through `linkComponent` /
 * `linkProp` (a router link), the rest are plain `<a>`; `openLinksInNewTab` opens external ones in a new tab.
 */
const Markdown = ({
	children = '',
	linkComponent: Link = 'a',
	linkProp = 'href',
	isInternalLink = defaultInternal,
	openLinksInNewTab = false,
	headingIds = true,
	className = '',
}: MarkdownProps) => {
	const seen = new Map<string, number>()
	const idFor = (text: string) => {
		const slug = slugify(text)
		if (!slug) return undefined
		const count = seen.get(slug) ?? 0
		seen.set(slug, count + 1)
		return count === 0 ? slug : `${slug}-${count}`
	}

	const renderInline = (nodes: Inline[]): ReactNode =>
		nodes.map((node, index) => {
			switch (node.type) {
				case 'text':
					return <Fragment key={index}>{node.text}</Fragment>
				case 'code':
					return (
						<code key={index} className="border border-app-border bg-app-card px-1 py-0.5 text-[0.85em] text-app-text">
							{node.text}
						</code>
					)
				case 'strong':
					return <strong key={index}>{renderInline(node.children)}</strong>
				case 'em':
					return <em key={index}>{renderInline(node.children)}</em>
				case 'del':
					return <del key={index}>{renderInline(node.children)}</del>
				case 'br':
					return <br key={index} />
				case 'image':
					return node.src ? (
						<MarkdownImage key={index} src={node.src} alt={node.alt} title={node.title} />
					) : (
						<Fragment key={index}>{node.alt}</Fragment>
					)
				case 'link': {
					if (!node.href) return <Fragment key={index}>{renderInline(node.children)}</Fragment>
					if (isInternalLink(node.href)) {
						return (
							<Link key={index} {...{ [linkProp]: node.href }} title={node.title} className={LINK_CLASS}>
								{renderInline(node.children)}
							</Link>
						)
					}
					return (
						<a
							key={index}
							href={node.href}
							title={node.title}
							className={LINK_CLASS}
							{...(openLinksInNewTab ? { target: '_blank' } : {})}
							rel="noopener noreferrer"
						>
							{renderInline(node.children)}
						</a>
					)
				}
			}
		})

	// `mixed`: a list with task and plain items keeps its bullets, so its task items are pulled back over the bullet column
	const renderItem = (item: ListItem, loose: boolean, mixed: boolean, index: number) => (
		<li
			key={index}
			className={item.checked !== null ? `flex list-none items-start gap-2 ${mixed ? '-ml-6' : ''}` : undefined}
		>
			{item.checked !== null && (
				<input
					type="checkbox"
					checked={item.checked}
					readOnly
					disabled
					aria-label={item.checked ? 'Done' : 'Not done'}
					className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--color-app-strong))]"
				/>
			)}
			<div className="min-w-0 flex-1">
				{item.children.map((child, i) =>
					// in a tight list the first paragraph is the item's own text, without paragraph spacing
					!loose && child.type === 'paragraph' ? (
						<Fragment key={i}>{renderInline(child.children)}</Fragment>
					) : (
						renderBlock(child, i)
					)
				)}
			</div>
		</li>
	)

	const renderBlock = (block: Block, index: number): ReactNode => {
		switch (block.type) {
			case 'heading': {
				const Tag = `h${block.level}` as ElementType
				return (
					<Tag
						key={index}
						id={headingIds ? idFor(inlineText(block.children)) : undefined}
						className={`m-0 text-app-text ${HEADINGS[block.level]}`}
					>
						{renderInline(block.children)}
					</Tag>
				)
			}
			case 'paragraph':
				return (
					<p key={index} className="m-0">
						{renderInline(block.children)}
					</p>
				)
			case 'blockquote':
				return (
					<blockquote key={index} className="m-0 flex flex-col gap-3 border-l-2 border-app-border pl-4 text-app-muted">
						{block.children.map(renderBlock)}
					</blockquote>
				)
			case 'list': {
				const Tag = (block.ordered ? 'ol' : 'ul') as ElementType
				const allTasks = block.items.every(item => item.checked !== null)
				const mixed = !allTasks && block.items.some(item => item.checked !== null)
				return (
					<Tag
						key={index}
						start={block.ordered && block.start !== 1 ? block.start : undefined}
						className={`m-0 flex flex-col pl-6 ${block.loose ? 'gap-3' : 'gap-1'} ${
							allTasks ? 'list-none pl-0' : block.ordered ? 'list-decimal' : 'list-disc'
						}`}
					>
						{block.items.map((item, i) => renderItem(item, block.loose, mixed, i))}
					</Tag>
				)
			}
			case 'code':
				return <CodeDisplay key={index} code={block.text} language={block.lang || undefined} />
			case 'hr':
				return <hr key={index} className="m-0 border-0 border-t border-app-border" />
			case 'table':
				return (
					<div key={index} className="overflow-x-auto border border-app-border">
						<table className="w-full border-collapse bg-app-card text-sm text-app-text">
							<thead>
								<tr className="border-b border-app-border bg-app-bg">
									{block.header.map((cell, c) => (
										<th key={c} scope="col" className={`px-4 py-2 font-semibold ${ALIGN[block.align[c] ?? 'left']}`}>
											{renderInline(cell)}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{block.rows.map((row, r) => (
									<tr key={r} className="border-b border-app-border last:border-b-0">
										{row.map((cell, c) => (
											<td key={c} className={`px-4 py-2 ${ALIGN[block.align[c] ?? 'left']}`}>
												{renderInline(cell)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)
		}
	}

	return (
		<div className={`flex flex-col gap-4 text-sm leading-relaxed text-app-text ${className}`}>
			{parseMarkdown(children).map(renderBlock)}
		</div>
	)
}

export default Markdown
