import { useId, useRef, useState } from 'react'
import useDismissable from '../hooks/useDismissable'
import Button from './Button'
import FloatingPanel from './FloatingPanel'

/**
 * Button that toggles a floating panel with arbitrary content. Closes on outside click and Escape
 * (focus returns to the trigger). The panel is portalled to <body>, so it is never clipped by an
 * ancestor, and it flips when there is no room.
 * placement: top | bottom | left | right | auto, optionally with -start / -end. `align` (start | end) is the
 * shorthand for bottom-start / bottom-end. Use ActionMenu for a plain list of actions.
 */
const Popover = ({ trigger, label, variant = 'secondary', align = 'start', placement, className = '', children }) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef(null)
	const panelRef = useRef(null)
	const panelId = useId()

	useDismissable(open, [rootRef, panelRef], reason => {
		setOpen(false)
		if (reason === 'escape') rootRef.current?.querySelector('button')?.focus()
	})

	return (
		<div ref={rootRef} className="relative inline-block">
			<Button
				variant={variant}
				aria-label={label}
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-controls={open ? panelId : undefined}
				onClick={() => setOpen(o => !o)}
			>
				{trigger}
			</Button>
			<FloatingPanel
				open={open}
				anchorRef={rootRef}
				panelRef={panelRef}
				placement={placement ?? `bottom-${align}`}
				id={panelId}
				role="dialog"
				aria-label={label}
				className={`min-w-[12rem] max-w-[calc(100vw-1rem)] border border-app-border bg-app-card p-4 text-sm text-app-text shadow-xl ${className}`}
			>
				{children}
			</FloatingPanel>
		</div>
	)
}

export default Popover
