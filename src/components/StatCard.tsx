import type { ElementType, MouseEventHandler, ReactNode } from 'react'
import type { Tone } from '../types'
import Chip from './Chip'
import Label from './Label'

export type Trend = 'up' | 'down' | 'flat'

export interface StatCardProps {
	label: ReactNode
	value: ReactNode
	/** Shown beside the value, colored by `trend`. */
	delta?: ReactNode
	trend?: Trend
	hint?: ReactNode
	/** An icon shown at the top right. */
	icon?: ReactNode
	/** A small status pill under the value (a Chip), coloured by `statusTone`. */
	status?: ReactNode
	statusTone?: 'default' | Tone
	/** Makes the tile a link. */
	href?: string
	/** Swap in a router link, e.g. `linkComponent={Link} linkProp="to"`. */
	linkComponent?: ElementType
	linkProp?: string
	/** Makes the tile a button (or runs as well as the link navigates). */
	onClick?: MouseEventHandler<HTMLElement>
	/** An unavailable tile: dimmed, not clickable, `aria-disabled`. */
	disabled?: boolean
	/** Shows a placeholder in place of the value and sets `aria-busy`. */
	loading?: boolean
	/** `compact` puts the value beside the label in a shorter tile. */
	size?: 'default' | 'compact'
	className?: string
}

const TRENDS: Record<Trend, string> = {
	up: 'text-emerald-700 dark:text-emerald-400',
	down: 'text-red-700 dark:text-red-400',
	flat: 'text-app-muted',
}

/**
 * Single metric tile. `delta` is shown beside the value; `trend` (up | down | flat) colors it. `icon` sits top right
 * and `status` adds a small Chip. Pass `href` (with `linkComponent` / `linkProp` for a router link) or `onClick` to
 * make the whole tile clickable; `size="compact"` puts the value beside the label in a shorter tile; `disabled` marks it unavailable; `loading` shows a placeholder for the value.
 */
const StatCard = ({
	label,
	value,
	delta,
	trend = 'flat',
	hint,
	icon,
	status,
	statusTone = 'default',
	href,
	linkComponent: Link = 'a',
	linkProp = 'href',
	onClick,
	disabled = false,
	loading = false,
	size = 'default',
	className = '',
}: StatCardProps) => {
	const wantsLink = href !== undefined
	const interactive = (wantsLink || !!onClick) && !disabled
	const compact = size === 'compact'
	const frame = `flex w-full border border-app-border bg-app-card text-left ${
		compact ? 'items-center gap-3 px-3 py-2' : 'flex-col gap-1 p-4'
	} ${
		interactive
			? 'transition hover:border-app-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-strong'
			: ''
	} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`

	const valueRow = (
		<span className="flex items-baseline gap-2">
			{loading ? (
				<span
					aria-hidden="true"
					className={`block animate-pulse bg-app-border ${compact ? 'h-6 w-12' : 'my-1 h-6 w-20'}`}
				/>
			) : (
				<span className="text-2xl font-bold tracking-tight text-app-text">{value}</span>
			)}
			{!loading && delta && (
				<span className={`text-xs font-semibold ${TRENDS[trend]}`}>
					<span aria-hidden="true">{trend === 'up' ? '▲ ' : trend === 'down' ? '▼ ' : ''}</span>
					{delta}
				</span>
			)}
		</span>
	)
	const iconBox = icon && <span className="shrink-0 text-app-muted [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
	const statusChip = status && (
		<span className="flex">
			<Chip size="sm" tone={statusTone}>
				{status}
			</Chip>
		</span>
	)
	const hintText = hint && <span className="text-xs text-app-muted">{hint}</span>

	// Compact keeps the label first in the DOM (reading order) and shows the value before it with `order`
	const content = compact ? (
		<>
			<span className="order-2 flex min-w-0 flex-1 flex-col gap-1">
				<Label>{label}</Label>
				{statusChip}
				{hintText}
			</span>
			<span className="order-1 shrink-0 self-center">{valueRow}</span>
			<span className="order-3">{iconBox}</span>
		</>
	) : (
		<>
			<span className="flex items-start justify-between gap-2">
				<Label>{label}</Label>
				{iconBox}
			</span>
			{valueRow}
			{statusChip}
			{hintText}
		</>
	)

	const shared = { 'aria-busy': loading || undefined, 'aria-disabled': disabled || undefined }

	if (interactive && wantsLink)
		return (
			<Link {...{ [linkProp]: href }} onClick={onClick} className={`${frame} no-underline`} {...shared}>
				{content}
			</Link>
		)
	if (interactive)
		return (
			<button type="button" onClick={onClick} className={frame} {...shared}>
				{content}
			</button>
		)
	return (
		<div className={frame} {...shared}>
			{content}
		</div>
	)
}

export default StatCard
