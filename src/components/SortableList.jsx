import { useState } from 'react'

const move = (list, from, to) => {
	const next = [...list]
	const [item] = next.splice(from, 1)
	next.splice(to, 0, item)
	return next
}

/**
 * Drag-and-drop reorderable list (HTML5 drag events, no dependencies). `items` are objects with a unique `key`;
 * `onChange` receives the reordered array. Each row has a drag handle that also works from the keyboard:
 * focus it and press Up / Down to move the row.
 * `renderItem(item, index)` renders the row's content.
 */
const SortableList = ({ items, onChange, renderItem, label = 'Sortable list', className = '' }) => {
	const [dragKey, setDragKey] = useState(null)
	const [overKey, setOverKey] = useState(null)
	const [announce, setAnnounce] = useState('')

	const reorder = (from, to) => {
		if (from === to || to < 0 || to >= items.length) return
		onChange(move(items, from, to))
	}

	return (
		<>
			<ul aria-label={label} className={`m-0 list-none border border-app-border bg-app-card p-0 ${className}`}>
				{items.map((item, index) => (
					<li
						key={item.key}
						draggable
						onDragStart={event => {
							setDragKey(item.key)
							event.dataTransfer.effectAllowed = 'move'
							event.dataTransfer.setData('text/plain', String(item.key))
						}}
						onDragOver={event => {
							event.preventDefault()
							if (item.key !== overKey) setOverKey(item.key)
						}}
						onDrop={event => {
							event.preventDefault()
							const from = items.findIndex(i => i.key === dragKey)
							reorder(from, index)
							setDragKey(null)
							setOverKey(null)
						}}
						onDragEnd={() => {
							setDragKey(null)
							setOverKey(null)
						}}
						className={`flex items-center gap-3 border-b border-app-border px-3 py-2.5 last:border-b-0 ${
							dragKey === item.key ? 'opacity-40' : ''
						} ${overKey === item.key && dragKey !== item.key ? 'bg-app-soft/20' : ''}`}
					>
						<button
							type="button"
							aria-label={`Reorder ${item.label ?? item.key}. Use up and down arrow keys.`}
							onKeyDown={event => {
								const to = event.key === 'ArrowUp' ? index - 1 : event.key === 'ArrowDown' ? index + 1 : null
								if (to === null || to < 0 || to >= items.length) return
								event.preventDefault()
								const handle = event.currentTarget
								reorder(index, to)
								setAnnounce(`${item.label ?? item.key} moved to position ${to + 1} of ${items.length}`)
								// Keep focus on the handle after the row re-renders in its new place
								requestAnimationFrame(() => handle.focus())
							}}
							className="cursor-grab select-none px-1 text-app-muted transition hover:text-app-text active:cursor-grabbing"
						>
							<span aria-hidden="true">⋮⋮</span>
						</button>
						<div className="min-w-0 flex-1 text-sm text-app-text">{renderItem(item, index)}</div>
					</li>
				))}
			</ul>
			<div role="status" aria-live="polite" className="sr-only">
				{announce}
			</div>
		</>
	)
}

export default SortableList
