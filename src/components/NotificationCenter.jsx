import { useId, useRef, useState } from 'react'
import useDismissable from '../hooks/useDismissable'
import Badge from './Badge'
import Button from './Button'
import FloatingPanel from './FloatingPanel'

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
 * `onMarkRead(id)` if unread); `onMarkAllRead` and `onClear` add header actions when provided.
 */
const NotificationCenter = ({
	notifications,
	onSelect,
	onMarkRead,
	onMarkAllRead,
	onClear,
	empty = 'You are all caught up',
	align = 'end',
}) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef(null)
	const panelRef = useRef(null)
	const panelId = useId()
	const unread = notifications.filter(n => !n.read).length

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
					<span className="flex gap-3 text-xs">
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
						{notifications.map(n => (
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
			</FloatingPanel>
		</div>
	)
}

export default NotificationCenter
