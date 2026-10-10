import BetaBadge from './BetaBadge'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tree } from 'xedonium'

/**
 * The docs sidebar: a Tree whose top level is shown in caps and whose pages are plain sentence-case links.
 * `items`: [{ key (a path), label, href?, target?, icon?, children? }]. A top-level page with an `icon` shows it in the
 * slot where groups have their chevron, so the labels stay aligned. Pages have an `href`; selecting a group opens it and
 * calls `onNavigate(target ?? key, node)`. `onSelect` fires when a page link is clicked.
 */
const DocsNav = ({ items, activePath: currentPath, onNavigate, onSelect, footer, className = '' }) => {
	// A page below an item's path (/playground/charts under /playground) highlights that item; exact matches win
	const keys = items.flatMap(item => [item.key, ...(item.children?.map(child => child.key) ?? [])])
	const activePath =
		keys.find(key => key === currentPath) ??
		keys.filter(key => currentPath.startsWith(`${key}/`)).sort((a, b) => b.length - a.length)[0] ??
		currentPath
	const parentOf = path => items.find(item => item.children?.some(child => child.key === path))?.key
	const [expanded, setExpanded] = useState(() => [parentOf(activePath)].filter(Boolean))

	// Keep the group of the current page open (also when it is reached from search or a link)
	useEffect(() => {
		const parent = parentOf(activePath)
		if (parent) setExpanded(current => (current.includes(parent) ? current : [...current, parent]))
		// parentOf only reads `items`
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activePath, items])

	const byKey = new Map()
	const visit = nodes =>
		nodes.forEach(node => {
			byKey.set(node.key, node)
			if (node.children) visit(node.children)
		})
	visit(items)

	const renderLabel = (node, depth) => {
		const { href, icon, beta } = byKey.get(node.key)
		const text =
			depth === 0 ? (
				<span className="text-xs font-semibold uppercase tracking-widest text-app-muted">{node.label}</span>
			) : (
				<span className="flex min-w-0 items-center gap-2 text-sm">
					<span className="truncate">{node.label}</span>
					{beta && <BetaBadge />}
				</span>
			)
		// Pages are real links (open in a new tab, copy address); groups are handled by the row click
		return href ? (
			<Link
				to={href}
				onClick={event => {
					event.stopPropagation()
					onSelect?.(node.key)
				}}
				className={`flex min-w-0 flex-1 items-center truncate ${depth > 0 ? '-ml-2' : ''} ${icon && depth === 0 ? '-ml-6 gap-1' : ''}`}
			>
				{icon && depth === 0 && (
					<span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center text-app-muted">
						{icon}
					</span>
				)}
				{text}
			</Link>
		) : (
			<span className={`min-w-0 flex-1 truncate ${depth > 0 ? '-ml-2' : ''}`}>{text}</span>
		)
	}

	return (
		<nav
			aria-label="Documentation"
			className={`flex h-full flex-col border-r border-app-border bg-app-card ${className}`}
		>
			<div className="flex-1 overflow-y-auto py-2">
				<Tree
					label="Documentation"
					nodes={items}
					selected={activePath}
					expanded={expanded}
					onExpandedChange={setExpanded}
					onSelect={key => {
						const node = byKey.get(key)
						onNavigate?.(node.target ?? node.key, node)
					}}
					renderLabel={renderLabel}
				/>
			</div>
			{footer && <div className="shrink-0 border-t border-app-border px-3 py-3">{footer}</div>}
		</nav>
	)
}

export default DocsNav
