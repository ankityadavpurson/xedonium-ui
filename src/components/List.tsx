import type { ReactNode } from 'react'

export interface ListItem {
	key: string | number
	primary: ReactNode
	secondary?: ReactNode
	leading?: ReactNode
	trailing?: ReactNode
	/** Makes the row a button. */
	onClick?: () => void
}

export interface ListProps {
	items: ListItem[]
	/** Rule between rows (default true). */
	divided?: boolean
	className?: string
}

/** Vertical list. items: [{ key, primary, secondary?, leading?, trailing?, onClick? }]. Clickable rows become buttons. */
const List = ({ items, divided = true, className = '' }: ListProps) => (
	<ul className={`m-0 list-none border border-app-border bg-app-card p-0 ${className}`}>
		{items.map(item => {
			const body = (
				<>
					{item.leading && <span className="shrink-0">{item.leading}</span>}
					<span className="min-w-0 flex-1 text-left">
						<span className="block truncate text-sm text-app-text">{item.primary}</span>
						{item.secondary && <span className="block truncate text-xs text-app-muted">{item.secondary}</span>}
					</span>
					{item.trailing && <span className="shrink-0 text-xs text-app-muted">{item.trailing}</span>}
				</>
			)
			return (
				<li key={item.key} className={divided ? 'border-b border-app-border last:border-b-0' : ''}>
					{item.onClick ? (
						<button
							type="button"
							onClick={item.onClick}
							className="flex w-full items-center gap-3 px-4 py-3 transition hover:bg-app-bg"
						>
							{body}
						</button>
					) : (
						<div className="flex items-center gap-3 px-4 py-3">{body}</div>
					)}
				</li>
			)
		})}
	</ul>
)

export default List
