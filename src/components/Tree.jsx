import { useState } from 'react'

// Visible nodes in display order, with depth and parent key
const flatten = (nodes, expanded, depth = 0, parent = null, out = []) => {
	nodes.forEach(node => {
		out.push({ node, depth, parent })
		if (node.children?.length && expanded.includes(node.key)) flatten(node.children, expanded, depth + 1, node.key, out)
	})
	return out
}

/**
 * Expandable tree. nodes: [{ key, label, children? }]. `selected` / `onSelect` (key) for selection;
 * expansion is uncontrolled via `defaultExpanded` (array of keys) unless `expanded` + `onExpandedChange` are given.
 * Keys: Up / Down move, Right expands or enters, Left collapses or goes to the parent, Enter / Space selects.
 */
const Tree = ({
	nodes,
	selected,
	onSelect,
	defaultExpanded = [],
	expanded,
	onExpandedChange,
	label = 'Tree',
	className = '',
}) => {
	const [innerExpanded, setInnerExpanded] = useState(defaultExpanded)
	const open = expanded ?? innerExpanded
	const [focusKey, setFocusKey] = useState(null)

	const setOpen = next => {
		if (expanded === undefined) setInnerExpanded(next)
		onExpandedChange?.(next)
	}
	const toggle = key => setOpen(open.includes(key) ? open.filter(k => k !== key) : [...open, key])

	const rows = flatten(nodes, open)
	const activeKey = rows.some(r => r.node.key === focusKey) ? focusKey : rows[0]?.node.key

	const focusRow = key => {
		setFocusKey(key)
		requestAnimationFrame(() => document.getElementById(`${idPrefix}-${key}`)?.focus())
	}
	const idPrefix = `tree-${label.replace(/\W+/g, '-')}`

	const handleKeyDown = (event, index) => {
		const { node, parent } = rows[index]
		const hasChildren = !!node.children?.length
		const isOpen = open.includes(node.key)
		switch (event.key) {
			case 'ArrowDown':
				if (rows[index + 1]) focusRow(rows[index + 1].node.key)
				break
			case 'ArrowUp':
				if (rows[index - 1]) focusRow(rows[index - 1].node.key)
				break
			case 'ArrowRight':
				if (hasChildren && !isOpen) toggle(node.key)
				else if (hasChildren) focusRow(node.children[0].key)
				break
			case 'ArrowLeft':
				if (hasChildren && isOpen) toggle(node.key)
				else if (parent !== null) focusRow(parent)
				break
			case 'Home':
				focusRow(rows[0].node.key)
				break
			case 'End':
				focusRow(rows[rows.length - 1].node.key)
				break
			case 'Enter':
			case ' ':
				onSelect?.(node.key)
				break
			default:
				return
		}
		event.preventDefault()
	}

	return (
		<ul role="tree" aria-label={label} className={`m-0 list-none p-0 text-sm text-app-text ${className}`}>
			{rows.map(({ node, depth }, index) => {
				const hasChildren = !!node.children?.length
				const isOpen = open.includes(node.key)
				const isSelected = selected === node.key
				return (
					<li
						key={node.key}
						id={`${idPrefix}-${node.key}`}
						role="treeitem"
						aria-level={depth + 1}
						aria-expanded={hasChildren ? isOpen : undefined}
						aria-selected={isSelected}
						tabIndex={node.key === activeKey ? 0 : -1}
						onKeyDown={event => handleKeyDown(event, index)}
						onFocus={() => setFocusKey(node.key)}
						className="list-none outline-none"
					>
						<div
							style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
							className={`flex cursor-pointer items-center gap-1 py-1.5 pr-3 transition hover:bg-app-bg ${
								isSelected ? 'bg-app-soft/20 font-semibold' : ''
							}`}
							onClick={() => {
								onSelect?.(node.key)
								if (hasChildren) toggle(node.key)
							}}
						>
							<span aria-hidden="true" className="w-4 text-center text-xs text-app-muted">
								{hasChildren ? (isOpen ? '▾' : '▸') : ''}
							</span>
							{node.label}
						</div>
					</li>
				)
			})}
		</ul>
	)
}

export default Tree
