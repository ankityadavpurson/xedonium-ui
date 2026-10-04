import { useEffect, useId, useRef, useState } from 'react'
import Button from './Button'

/**
 * Button that toggles a floating panel with arbitrary content. Closes on outside click and Escape
 * (focus returns to the trigger). align: start | end. Use ActionMenu for a plain list of actions.
 */
const Popover = ({ trigger, label, variant = 'secondary', align = 'start', className = '', children }) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef(null)
	const panelId = useId()

	useEffect(() => {
		if (!open) return undefined
		const onPointerDown = event => {
			if (!rootRef.current?.contains(event.target)) setOpen(false)
		}
		const onKeyDown = event => {
			if (event.key === 'Escape') {
				setOpen(false)
				rootRef.current?.querySelector('button')?.focus()
			}
		}
		document.addEventListener('mousedown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('mousedown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [open])

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
			{open && (
				<div
					id={panelId}
					role="dialog"
					aria-label={label}
					className={`absolute top-full z-[var(--xd-z-tooltip,70)] mt-1 min-w-[12rem] border border-app-border bg-app-card p-4 text-sm text-app-text shadow-xl ${
						align === 'end' ? 'right-0' : 'left-0'
					} ${className}`}
				>
					{children}
				</div>
			)}
		</div>
	)
}

export default Popover
