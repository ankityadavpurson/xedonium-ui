import { useState, type ReactNode } from 'react'

export interface VirtualListProps<Item = unknown> {
	items: Item[]
	/** Fixed row height in px. */
	itemHeight: number
	/** Viewport height in px. */
	height?: number
	/** Extra rows rendered above and below. */
	overscan?: number
	renderItem: (item: Item, index: number) => ReactNode
	getKey?: (item: Item, index: number) => string | number
	/** Accessible name of the list. */
	label?: string
	className?: string
}

/**
 * Windowed list for large datasets: only the visible rows (plus `overscan`) are rendered.
 * Rows must have a fixed `itemHeight` (px). `renderItem(item, index)` renders a row; `getKey(item, index)` keys it.
 */
const VirtualList = <Item,>({
	items,
	itemHeight,
	height = 320,
	overscan = 4,
	renderItem,
	getKey,
	label = 'List',
	className = '',
}: VirtualListProps<Item>) => {
	const [scrollTop, setScrollTop] = useState(0)
	const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
	const end = Math.min(items.length, Math.ceil((scrollTop + height) / itemHeight) + overscan)

	return (
		<div
			role="list"
			aria-label={label}
			aria-rowcount={items.length}
			tabIndex={0}
			onScroll={event => setScrollTop(event.currentTarget.scrollTop)}
			style={{ height }}
			className={`overflow-y-auto border border-app-border bg-app-card ${className}`}
		>
			<div style={{ height: items.length * itemHeight, position: 'relative' }}>
				{items.slice(start, end).map((item, offset) => {
					const index = start + offset
					return (
						<div
							key={getKey ? getKey(item, index) : index}
							role="listitem"
							aria-posinset={index + 1}
							aria-setsize={items.length}
							style={{ position: 'absolute', top: index * itemHeight, height: itemHeight, left: 0, right: 0 }}
							className="flex items-center border-b border-app-border px-4 text-sm text-app-text"
						>
							{renderItem(item, index)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default VirtualList
