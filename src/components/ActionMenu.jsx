import { useEffect, useId, useRef, useState } from 'react'
import Button from './Button'

const TONES = {
	default: 'text-app-text hover:bg-app-bg',
	warning: 'text-amber-700 hover:bg-amber-400/10 dark:text-amber-400',
}

/**
 * Dropdown of page actions. Closes on outside click and Escape (focus returns to the trigger).
 * items: [{ key, label, description?, badge?, tone?, disabled?, hasDialog?, onClick }]
 * `trigger` is the button content; `variant` styles the trigger (e.g. 'warning' to flag pending work).
 */
const ActionMenu = ({ label, trigger, variant = 'secondary', items, className = '' }) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef(null)
	const menuId = useId()

	useEffect(() => {
		if (!open) return

		const closeOnOutsideClick = event => {
			if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
		}
		const closeOnEscape = event => {
			if (event.key !== 'Escape') return
			setOpen(false)
			rootRef.current?.querySelector('button')?.focus()
		}

		document.addEventListener('mousedown', closeOnOutsideClick)
		document.addEventListener('keydown', closeOnEscape)
		return () => {
			document.removeEventListener('mousedown', closeOnOutsideClick)
			document.removeEventListener('keydown', closeOnEscape)
		}
	}, [open])

	const run = item => {
		setOpen(false)
		item.onClick()
	}

	return (
		<div ref={rootRef} className={`relative ${className}`}>
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

			{open && (
				<div
					id={menuId}
					role="menu"
					aria-label={label}
					className="absolute right-0 top-full z-20 mt-2 w-60 overflow-hidden border border-app-border bg-app-card shadow-lg"
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
				</div>
			)}
		</div>
	)
}

export default ActionMenu
