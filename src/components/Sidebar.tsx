import type { ElementType, ReactElement, ReactNode } from 'react'
import Tooltip from './Tooltip'

export interface SidebarItem {
	key: string
	/** Optional for a `divider`. */
	label?: string
	icon?: ReactNode
	href?: string
	onClick?: () => void
	badge?: ReactNode
	/** A non-interactive caption that groups the items after it (e.g. "Main Menu"); only `key` and `label` are used. */
	section?: boolean
	/** A plain rule between groups; only `key` is used. A `section` with no label renders the same way. */
	divider?: boolean
	/** Makes the item a group with an indented sub-list. */
	children?: SidebarItem[]
}

export interface SidebarProps {
	items: SidebarItem[]
	/** Key of the current item. */
	activeKey?: string
	/** Fires on any item click. */
	onSelect?: (key: string) => void
	header?: ReactNode
	footer?: ReactNode
	/** Icons only (give every item an `icon`). */
	collapsed?: boolean
	/** Swap in a router link, e.g. `linkComponent={Link} linkProp="to"`. */
	linkComponent?: ElementType
	linkProp?: string
	/** Accessible name of the `nav`. */
	label?: string
	/** Draw the separators: the right edge, and the lines under the header and over the footer (default true). */
	bordered?: boolean
	/** Vertical size of the items (default `default`). */
	density?: 'dense' | 'default' | 'comfortable'
	/** Replaces the header's default padding (`px-3 py-3`). */
	headerClassName?: string
	/** Replaces the list's default padding (`py-2`). */
	listClassName?: string
	/** Draw the right edge (default: the value of `bordered`), independent of the header and footer lines. */
	borderRight?: boolean
	/** Tailwind width class of the expanded sidebar (default `w-60`); `w-full` fills a container such as a drawer. */
	width?: string
	/** `none` shows sentence-case labels (larger, regular tracking) instead of the default small capitals. */
	textCase?: 'uppercase' | 'none'
	/** Size of the item icons (default `sm` = 16px, `md` = 20px). */
	iconSize?: 'sm' | 'md'
	/** Added to every item row. */
	itemClassName?: string
	className?: string
}

/**
 * Vertical navigation. items: [{ key, label, icon?, href?, onClick?, badge?, children? }]; `children` makes a group
 * with an indented sub-list. `activeKey` marks the current item; `onSelect(key)` fires on any item click.
 * `collapsed` shows icons only (give every item an `icon`). `linkComponent` / `linkProp` swap in a router link.
 * `section: true` makes an item a caption (a thin divider when collapsed). Labels cut off by the width get a tooltip.
 * `bordered={false}` removes the separators; `density` sets the item height; `headerClassName` / `listClassName` replace
 * the header and list padding. `divider: true` adds a plain rule; `borderRight` and `bordered` can differ;
 * `width`, `textCase`, `iconSize` and `itemClassName` adjust the size and look of the rows.
 */
const DENSITY: Record<'dense' | 'default' | 'comfortable', string> = {
	dense: 'py-1.5',
	default: 'py-2',
	comfortable: 'py-3',
}

const Sidebar = ({
	items,
	activeKey,
	onSelect,
	header,
	footer,
	collapsed = false,
	linkComponent: Link = 'a',
	linkProp = 'href',
	label = 'Sidebar',
	bordered = true,
	borderRight = bordered,
	width = 'w-60',
	textCase = 'uppercase',
	iconSize = 'sm',
	itemClassName = '',
	density = 'default',
	headerClassName = 'px-3 py-3',
	listClassName = 'py-2',
	className = '',
}: SidebarProps) => {
	const renderItem = (item: SidebarItem, depth = 0): ReactNode => {
		if (item.divider || (item.section && !item.label))
			return <li key={item.key} role="separator" className="mx-2 my-2 border-t border-app-border" />
		if (item.section)
			return collapsed ? (
				<li key={item.key} role="separator" className="mx-2 my-2 border-t border-app-border" />
			) : (
				<li
					key={item.key}
					role="presentation"
					className="truncate px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-app-muted"
				>
					{item.label}
				</li>
			)
		const active = item.key === activeKey
		const content = (
			<>
				{item.icon && (
					<span className={`shrink-0 ${iconSize === 'md' ? '[&>svg]:h-5 [&>svg]:w-5' : '[&>svg]:h-4 [&>svg]:w-4'}`}>
						{item.icon}
					</span>
				)}
				{!collapsed && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
				{!collapsed && item.badge != null && (
					<span className="bg-app-strong px-1.5 text-[10px] font-semibold text-app-bg">{item.badge}</span>
				)}
			</>
		)
		const classes = `flex w-full items-center gap-3 ${DENSITY[density]} ${
			textCase === 'none' ? 'text-sm font-medium' : 'text-xs font-semibold uppercase tracking-widest'
		} transition ${
			active ? 'bg-app-strong text-app-bg' : 'text-app-muted hover:bg-app-bg hover:text-app-text'
		} ${collapsed ? 'justify-center px-2' : 'pr-3'} ${itemClassName}`
		const style = collapsed ? undefined : { paddingLeft: `${0.75 + depth * 1}rem` }
		const handle = () => {
			item.onClick?.()
			onSelect?.(item.key)
		}
		const hasChildren = !!item.children?.length
		// Collapsed items already carry the label as `title`; expanded ones get a tooltip if the label is truncated
		const withTip = (node: ReactElement<{ 'aria-label'?: string }>) =>
			collapsed ? (
				node
			) : (
				<Tooltip text={item.label} placement="right" onlyIfTruncated className="flex w-full">
					{node}
				</Tooltip>
			)

		return (
			<li key={item.key}>
				{item.href && !hasChildren
					? withTip(
							<Link
								{...{ [linkProp]: item.href }}
								aria-current={active ? 'page' : undefined}
								aria-label={collapsed ? item.label : undefined}
								title={collapsed ? item.label : undefined}
								onClick={handle}
								className={classes}
								style={style}
							>
								{content}
							</Link>
						)
					: withTip(
							<button
								type="button"
								aria-current={active ? 'page' : undefined}
								aria-label={collapsed ? item.label : undefined}
								title={collapsed ? item.label : undefined}
								onClick={handle}
								className={classes}
								style={style}
							>
								{content}
							</button>
						)}
				{hasChildren && !collapsed && (
					<ul className="m-0 list-none p-0">{item.children?.map(child => renderItem(child, depth + 1))}</ul>
				)}
			</li>
		)
	}

	return (
		<nav
			aria-label={label}
			className={`flex h-full flex-col bg-app-card ${borderRight ? 'border-r border-app-border' : ''} ${collapsed ? 'w-14' : width} ${className}`}
		>
			{header && (
				<div className={`shrink-0 ${bordered ? 'border-b border-app-border' : ''} ${headerClassName}`}>{header}</div>
			)}
			<ul className={`m-0 flex-1 list-none overflow-y-auto p-0 ${listClassName}`}>
				{items.map(item => renderItem(item))}
			</ul>
			{footer && <div className={`shrink-0 px-3 py-3 ${bordered ? 'border-t border-app-border' : ''}`}>{footer}</div>}
		</nav>
	)
}

export default Sidebar
