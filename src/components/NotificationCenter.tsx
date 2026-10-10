import { useId, useRef, useState, type ElementType, type ReactNode } from 'react'
import useDismissable from '../hooks/useDismissable'
import Badge from './Badge'
import Button from './Button'
import FloatingPanel from './FloatingPanel'

export interface Notification {
	id: string | number
	title: ReactNode
	body?: ReactNode
	time?: ReactNode
	read?: boolean
}

export interface NotificationCenterProps {
	notifications: Notification[]
	/** Called when a notification is clicked. */
	onSelect?: (notification: Notification) => void
	/** Called with the id of an unread notification that was clicked. */
	onMarkRead?: (id: Notification['id']) => void
	/** Adds a "Mark all read" action. */
	onMarkAllRead?: () => void
	/** Adds a "Clear" action. */
	onClear?: () => void
	/** Adds a "View all" action at the bottom of the list that calls this (open your notifications page). */
	onViewAll?: () => void
	/** Same, as a link: where "View all" goes. Use `linkComponent` / `linkProp` for a router link. */
	viewAllHref?: string
	/** Label for the "View all" action (default "View all"). */
	viewAllLabel?: string
	/** Swap in a router link for `viewAllHref`, e.g. `linkComponent={Link} linkProp="to"`. */
	linkComponent?: ElementType
	linkProp?: string
	/** Show only the newest this-many notifications; "View all" then says how many there are in total. */
	maxItems?: number
	/** Shown when there are none. */
	empty?: ReactNode
	align?: 'start' | 'end'
}

const viewAllClass =
	'block w-full px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-app-muted outline-none transition hover:bg-app-bg hover:text-app-text focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-strong'

const BellIcon = () => (
	<svg
		aria-hidden="true"
		focusable="false"
		className="h-5 w-5"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.8"
	>
		<path
			strokeLinecap="square"
			strokeLinejoin="miter"
			d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"
		/>
	</svg>
)

/**
 * Bell button with an unread count and a dropdown list.
 * notifications: [{ id, title, body?, time?, read? }]. Clicking one calls `onSelect(notification)` (and
 * `onMarkRead(id)` if unread); `onMarkAllRead` and `onClear` add header actions when provided. `onViewAll` (or
 * `viewAllHref`) adds a "View all" footer that closes the dropdown first, and `maxItems` trims the list to the newest few.
 */
const NotificationCenter = ({
	notifications,
	onSelect,
	onMarkRead,
	onMarkAllRead,
	onClear,
	onViewAll,
	viewAllHref,
	viewAllLabel = 'View all',
	linkComponent: Link = 'a',
	linkProp = 'href',
	maxItems,
	empty = 'You are all caught up',
	align = 'end',
}: NotificationCenterProps) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const panelId = useId()
	const unread = notifications.filter(n => !n.read).length
	const shown = maxItems === undefined ? notifications : notifications.slice(0, Math.max(maxItems, 0))
	const hidden = notifications.length - shown.length
	const viewAllText = hidden > 0 ? `${viewAllLabel} (${notifications.length})` : viewAllLabel

	useDismissable(open, [rootRef, panelRef], reason => {
		setOpen(false)
		if (reason === 'escape') rootRef.current?.querySelector('button')?.focus()
	})

	return (
		<div ref={rootRef} className="relative inline-block">
			<Button
				variant="secondary"
				aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-controls={open ? panelId : undefined}
				onClick={() => setOpen(o => !o)}
			>
				<Badge badgeContent={unread} max={9} color="danger" size="sm">
					<BellIcon />
				</Badge>
			</Button>
			<FloatingPanel
				open={open}
				anchorRef={rootRef}
				panelRef={panelRef}
				placement={`bottom-${align}`}
				id={panelId}
				role="dialog"
				aria-label="Notifications"
				className="flex max-h-96 w-80 max-w-[calc(100vw-1rem)] flex-col border border-app-border bg-app-card shadow-xl"
			>
				<div className="flex items-center justify-between gap-2 border-b border-app-border px-4 py-2.5">
					<span className="text-xs font-semibold uppercase tracking-widest text-app-text">Notifications</span>
					<span className="flex flex-wrap justify-end gap-3 text-xs">
						{onMarkAllRead && unread > 0 && (
							<button
								type="button"
								onClick={onMarkAllRead}
								className="text-app-muted underline underline-offset-2 hover:text-app-text"
							>
								Mark all read
							</button>
						)}
						{onClear && notifications.length > 0 && (
							<button
								type="button"
								onClick={onClear}
								className="text-app-muted underline underline-offset-2 hover:text-app-text"
							>
								Clear
							</button>
						)}
					</span>
				</div>
				{notifications.length === 0 ? (
					<p className="m-0 px-4 py-8 text-center text-sm text-app-muted">{empty}</p>
				) : (
					<ul className="m-0 flex-1 list-none overflow-y-auto p-0">
						{shown.map(n => (
							<li key={n.id} className="border-b border-app-border last:border-b-0">
								<button
									type="button"
									onClick={() => {
										if (!n.read) onMarkRead?.(n.id)
										onSelect?.(n)
									}}
									className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-app-bg"
								>
									<span
										aria-hidden="true"
										className={`mt-1.5 h-2 w-2 shrink-0 ${n.read ? 'bg-transparent' : 'bg-red-500'}`}
									/>
									<span className="min-w-0 flex-1">
										<span className={`block text-sm text-app-text ${n.read ? '' : 'font-semibold'}`}>{n.title}</span>
										{n.body && <span className="block text-xs text-app-muted">{n.body}</span>}
										{n.time && (
											<span className="mt-0.5 block text-[10px] uppercase tracking-widest text-app-muted">
												{n.time}
											</span>
										)}
									</span>
									{!n.read && <span className="sr-only">Unread</span>}
								</button>
							</li>
						))}
					</ul>
				)}
				{(onViewAll || viewAllHref) && (
					<div className="shrink-0 border-t border-app-border">
						{viewAllHref ? (
							<Link {...{ [linkProp]: viewAllHref }} onClick={() => setOpen(false)} className={viewAllClass}>
								{viewAllText}
							</Link>
						) : (
							<button
								type="button"
								onClick={() => {
									setOpen(false)
									onViewAll?.()
								}}
								className={viewAllClass}
							>
								{viewAllText}
							</button>
						)}
					</div>
				)}
			</FloatingPanel>
		</div>
	)
}

export default NotificationCenter
