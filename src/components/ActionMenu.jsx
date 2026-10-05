import { useId, useRef, useState } from 'react'
import useDismissable from '../hooks/useDismissable'
import Button from './Button'
import FloatingPanel from './FloatingPanel'

const TONES = {
	default: 'text-app-text hover:bg-app-bg',
	warning: 'text-amber-700 hover:bg-amber-400/10 dark:text-amber-400',
}

/**
 * Dropdown of page actions. Closes on outside click and Escape (focus returns to the trigger).
 * The menu is portalled to <body>, so scroll containers and overflow: hidden ancestors can't clip it.
 * items: [{ key, label, description?, badge?, tone?, disabled?, hasDialog?, onClick }]
 * `trigger` is the button content; `variant` styles the trigger (e.g. 'warning' to flag pending work).
 * `placement` is where the menu opens (default "bottom-start"; e.g. "bottom-end", "top-start"). It flips above or to the other edge when there is no room, and re-adjusts on scroll and resize.
 */
const ActionMenu = ({ label, trigger, variant = 'secondary', items, placement = 'bottom-start', className = '' }) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef(null)
	const panelRef = useRef(null)
	const menuId = useId()

	useDismissable(open, [rootRef, panelRef], reason => {
		setOpen(false)
		if (reason === 'escape') rootRef.current?.querySelector('button')?.focus()
	})

	const run = item => {
		setOpen(false)
		item.onClick()
	}

	return (
		<div ref={rootRef} className={`relative inline-block ${className}`}>
			<Button
				onClick={() => setOpen(prev => !prev)}
				variant={variant}
				aria-label={label}
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls={open ? menuId : undefined}
			>
				{trigger}
			</Button>

			<FloatingPanel
				open={open}
				anchorRef={rootRef}
				panelRef={panelRef}
				placement={placement}
				id={menuId}
				role="menu"
				aria-label={label}
				className="w-60 max-w-[calc(100vw-1rem)] overflow-hidden border border-app-border bg-app-card shadow-lg"
			>
				{items.map(item => (
					<button
						key={item.key}
						type="button"
						role="menuitem"
						disabled={item.disabled}
						aria-haspopup={item.hasDialog ? 'dialog' : undefined}
						onClick={() => run(item)}
						className={`flex w-full items-center gap-2 border-b border-app-border bg-app-card px-3 py-2.5 text-left transition last:border-b-0 disabled:cursor-not-allowed disabled:opacity-50 ${TONES[item.tone || 'default']}`}
					>
						<span className="min-w-0 flex-1">
							<span className="block text-xs font-medium uppercase tracking-widest">{item.label}</span>
							{item.description && (
								<span className="mt-0.5 block text-xs normal-case tracking-normal text-app-muted">
									{item.description}
								</span>
							)}
						</span>
						{item.badge != null && <span className="font-mono text-xs">{item.badge}</span>}
					</button>
				))}
			</FloatingPanel>
		</div>
	)
}

export default ActionMenu
