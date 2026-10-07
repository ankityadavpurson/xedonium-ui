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
 * make the whole tile clickable; `disabled` marks it unavailable; `loading` shows a placeholder for the value.
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
	className = '',
}: StatCardProps) => {
	const wantsLink = href !== undefined
	const interactive = (wantsLink || !!onClick) && !disabled
	const frame = `flex w-full flex-col gap-1 border border-app-border bg-app-card p-4 text-left ${
		interactive
			? 'transition hover:border-app-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-strong'
			: ''
	} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`

	const content = (
		<>
			<span className="flex items-start justify-between gap-2">
				<Label>{label}</Label>
				{icon && <span className="shrink-0 text-app-muted [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
			</span>
			<span className="flex items-baseline gap-2">
				{loading ? (
					<span aria-hidden="true" className="my-1 block h-6 w-20 animate-pulse bg-app-border" />
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
			{status && (
				<span className="flex">
					<Chip size="sm" tone={statusTone}>
						{status}
					</Chip>
				</span>
			)}
			{hint && <span className="text-xs text-app-muted">{hint}</span>}
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
