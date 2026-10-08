import { useRef, useState, type ReactNode } from 'react'
import useDismissable from '../hooks/useDismissable'
import type { Placement, Size } from '../types'
import FloatingActionButton, { FAB_POSITIONS, type FabPosition } from './FloatingActionButton'
import type { ButtonVariant } from './buttonClass'
import CloseIcon from './icons/Close'
import PlusIcon from './icons/Plus'

export interface SpeedDialAction {
	key: string
	/** The action's icon. */
	icon: ReactNode
	/** Its name: shown in a tooltip (or beside it with `showLabels`) and used as the accessible name. */
	label: string
	disabled?: boolean
	onClick?: () => void
}

export interface SpeedDialProps {
	actions: SpeedDialAction[]
	/** Icon of the main button (default a plus). */
	icon?: ReactNode
	/** Icon of the main button while open (default a close mark). */
	openIcon?: ReactNode
	/** Accessible name of the main button. */
	label?: string
	/** Which way the actions fan out. */
	direction?: 'up' | 'down' | 'left' | 'right'
	size?: Size
	/** `square` (the default) or `circle`; the actions follow the main button. */
	shape?: 'square' | 'circle'
	variant?: ButtonVariant
	/** Color of the main button: a Button variant name, or any CSS color such as `#e11d48` (it overrides `variant`). */
	color?: ButtonVariant | (string & {})
	/** Fix the whole control to a corner of the viewport. */
	position?: FabPosition
	/** Show each action's label beside it instead of in a tooltip. */
	showLabels?: boolean
	/** Open state (controlled). */
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	/** Hide the control entirely (for example while scrolling down). */
	hidden?: boolean
	className?: string
}

const LAYOUT = {
	up: 'bottom-full left-1/2 -translate-x-1/2 flex-col-reverse items-center pb-2',
	down: 'top-full left-1/2 -translate-x-1/2 flex-col items-center pt-2',
	left: 'right-full top-1/2 -translate-y-1/2 flex-row-reverse items-center pr-2',
	right: 'left-full top-1/2 -translate-y-1/2 flex-row items-center pl-2',
}
// Tooltips go on the side the actions do not fan towards
const TIP: Record<'up' | 'down' | 'left' | 'right', Placement> = {
	up: 'left',
	down: 'left',
	left: 'top',
	right: 'top',
}

/**
 * A floating action button that fans out related actions. It opens on hover, on click and from the keyboard, and
 * closes on outside click, Escape and after an action runs. `direction` picks where the actions appear and `position`
 * fixes the control to a corner of the viewport. Each action needs a `label`: it is the tooltip and the accessible name.
 */
const SpeedDial = ({
	actions,
	icon = <PlusIcon />,
	openIcon = <CloseIcon className="h-4 w-4" />,
	label = 'Actions',
	direction = 'up',
	size = 'md',
	shape = 'square',
	variant = 'default',
	color,
	position,
	showLabels = false,
	open,
	defaultOpen = false,
	onOpenChange,
	hidden = false,
	className = '',
}: SpeedDialProps) => {
	const [inner, setInner] = useState(defaultOpen)
	const isOpen = open ?? inner
	const rootRef = useRef<HTMLDivElement>(null)

	const setOpen = (next: boolean) => {
		if (open === undefined) setInner(next)
		onOpenChange?.(next)
	}

	useDismissable(isOpen, rootRef, reason => {
		setOpen(false)
		if (reason === 'escape') rootRef.current?.querySelector('button')?.focus()
	})

	if (hidden) return null

	const horizontal = direction === 'left' || direction === 'right'

	return (
		<div
			ref={rootRef}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			className={`${position ? `fixed z-[var(--xd-z-popover,85)] ${FAB_POSITIONS[position]}` : 'relative'} inline-flex ${className}`}
		>
			<FloatingActionButton
				size={size}
				shape={shape}
				variant={variant}
				color={color}
				aria-label={label}
				aria-haspopup="menu"
				aria-expanded={isOpen}
				onClick={() => setOpen(!isOpen)}
			>
				{isOpen ? openIcon : icon}
			</FloatingActionButton>
			{isOpen && (
				<div role="menu" aria-label={label} className={`absolute flex gap-2 ${LAYOUT[direction]}`}>
					{actions.map(action => (
						<div key={action.key} className={`flex items-center gap-2 ${horizontal ? 'flex-col' : 'flex-row'}`}>
							{showLabels && (
								<span className="whitespace-nowrap border border-app-border bg-app-card px-2 py-1 text-xs text-app-text shadow-xl">
									{action.label}
								</span>
							)}
							<FloatingActionButton
								role="menuitem"
								size="sm"
								shape={shape}
								variant="secondary"
								aria-label={action.label}
								tooltip={showLabels ? undefined : action.label}
								tooltipPlacement={TIP[direction]}
								disabled={action.disabled}
								onClick={() => {
									action.onClick?.()
									setOpen(false)
								}}
							>
								{action.icon}
							</FloatingActionButton>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default SpeedDial
