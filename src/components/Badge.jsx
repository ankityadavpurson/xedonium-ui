const colorClasses = {
	default: 'bg-app-strong text-app-bg',
	secondary: 'bg-app-muted text-app-bg',
	success: 'bg-emerald-600 text-white',
	danger: 'bg-red-600 text-white',
	warning: 'bg-amber-400 text-black',
	info: 'bg-sky-600 text-white',
}

const sizeClasses = {
	sm: 'h-4 min-w-4 px-1 pb-px text-[10px]',
	md: 'h-5 min-w-5 px-1.5 pb-px text-[11px]',
}

// Corner placement; `circular` pulls the badge in so it sits on the edge of a round child
const placement = (vertical, horizontal, circular) => {
	const offset = circular ? '14%' : '0'
	const x = horizontal === 'left' ? 'left' : 'right'
	const y = vertical === 'bottom' ? 'bottom' : 'top'
	return {
		style: { [x]: offset, [y]: offset },
		transform: `${horizontal === 'left' ? '-translate-x-1/2' : 'translate-x-1/2'} ${vertical === 'bottom' ? 'translate-y-1/2' : '-translate-y-1/2'}`,
	}
}

/**
 * Overlays a small indicator (a count, text or a dot) on the corner of its children, like an unread count on an icon.
 * `badgeContent` numbers above `max` show as "99+"; zero is hidden unless `showZero`. `variant="dot"` shows a plain dot.
 * `invisible` hides it. With no children the badge renders on its own, inline.
 * `size` is `sm` or `md`. Colors: `default`, `secondary`, `success`, `danger`, `warning`, `info`.
 */
const Badge = ({
	badgeContent,
	color = 'default',
	size = 'md',
	variant = 'standard',
	max = 99,
	showZero = false,
	invisible,
	overlap = 'rectangular',
	anchorOrigin,
	className = '',
	children,
	...rest
}) => {
	const dot = variant === 'dot'
	const empty = badgeContent === undefined || badgeContent === null || badgeContent === false || badgeContent === ''
	const hidden = invisible ?? (!dot && (empty || (badgeContent === 0 && !showZero)))
	const content = typeof badgeContent === 'number' && badgeContent > max ? `${max}+` : badgeContent
	const { vertical = 'top', horizontal = 'right' } = anchorOrigin ?? {}
	const position = placement(vertical, horizontal, overlap === 'circular')
	const hasChildren = children !== undefined && children !== null

	return (
		<span className={`relative inline-flex shrink-0 align-middle ${className}`} {...rest}>
			{children}
			<span
				data-hidden={hidden}
				style={hasChildren ? position.style : undefined}
				className={`z-10 inline-flex items-center justify-center whitespace-nowrap font-semibold leading-none ring-2 ring-app-bg transition-transform ${
					colorClasses[color]
				} ${dot ? 'h-2 w-2' : sizeClasses[size]} ${
					hasChildren ? `absolute ${position.transform} ${hidden ? 'scale-0' : 'scale-100'}` : hidden ? 'hidden' : ''
				}`}
			>
				{dot ? null : content}
			</span>
		</span>
	)
}

export default Badge
