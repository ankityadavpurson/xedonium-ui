/**
 * Vertical navigation. items: [{ key, label, icon?, href?, onClick?, badge?, children? }]; `children` makes a group
 * with an indented sub-list. `activeKey` marks the current item; `onSelect(key)` fires on any item click.
 * `collapsed` shows icons only (give every item an `icon`). `linkComponent` / `linkProp` swap in a router link.
 */
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
	className = '',
}) => {
	const renderItem = (item, depth = 0) => {
		const active = item.key === activeKey
		const content = (
			<>
				{item.icon && <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>}
				{!collapsed && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
				{!collapsed && item.badge != null && (
					<span className="bg-app-strong px-1.5 text-[10px] font-semibold text-app-bg">{item.badge}</span>
				)}
			</>
		)
		const classes = `flex w-full items-center gap-3 py-2 text-xs font-semibold uppercase tracking-widest transition ${
			active ? 'bg-app-strong text-app-bg' : 'text-app-muted hover:bg-app-bg hover:text-app-text'
		} ${collapsed ? 'justify-center px-2' : 'pr-3'}`
		const style = collapsed ? undefined : { paddingLeft: `${0.75 + depth * 1}rem` }
		const handle = () => {
			item.onClick?.()
			onSelect?.(item.key)
		}
		const hasChildren = !!item.children?.length

		return (
			<li key={item.key}>
				{item.href && !hasChildren ? (
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
				) : (
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
					<ul className="m-0 list-none p-0">{item.children.map(child => renderItem(child, depth + 1))}</ul>
				)}
			</li>
		)
	}

	return (
		<nav
			aria-label={label}
			className={`flex h-full flex-col border-r border-app-border bg-app-card ${collapsed ? 'w-14' : 'w-60'} ${className}`}
		>
			{header && <div className="shrink-0 border-b border-app-border px-3 py-3">{header}</div>}
			<ul className="m-0 flex-1 list-none overflow-y-auto p-0 py-2">{items.map(item => renderItem(item))}</ul>
			{footer && <div className="shrink-0 border-t border-app-border px-3 py-3">{footer}</div>}
		</nav>
	)
}

export default Sidebar
