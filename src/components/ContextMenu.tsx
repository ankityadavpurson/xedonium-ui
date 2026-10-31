import { useRef, useState, type ElementType, type MouseEvent, type ReactNode } from 'react'
import Menu, { type MenuItem, type MenuLook } from './Menu'

export interface ContextMenuProps {
	/** Same entries as Menu: icons, shortcuts, dividers, danger items and nested `children`. */
	items: MenuItem[]
	/** The area that opens the menu when it is right-clicked (or long-pressed on touch, or the Menu key is pressed). */
	children: ReactNode
	/** Accessible name of the menu. */
	label?: string
	/** Leave the browser's own menu alone. */
	disabled?: boolean
	onOpenChange?: (open: boolean) => void
	/** `actions` gives the menu the look of ActionMenu (see Menu). */
	look?: MenuLook
	/** Router link for items with an `href` (see Menu). */
	linkComponent?: ElementType
	linkProp?: string
	/** Classes of the wrapping element. */
	className?: string
}

/**
 * A custom menu that opens at the pointer when its children are right-clicked, replacing the browser's own context
 * menu there. It is a Menu, so it has the same items, keyboard support (arrows, Home / End, Enter, Escape) and nested
 * submenus; it moves to the other side of the pointer when there is no room. Right-clicking again elsewhere moves it.
 */
const ContextMenu = ({
	items,
	children,
	label,
	disabled = false,
	onOpenChange,
	look,
	linkComponent,
	linkProp,
	className = '',
}: ContextMenuProps) => {
	const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
	const anchorRef = useRef<HTMLSpanElement>(null)

	const setOpen = (open: boolean) => {
		if (!open) setPoint(null)
		onOpenChange?.(open)
	}

	const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
		if (disabled || event.defaultPrevented) return
		event.preventDefault()
		// the Menu key and Shift+F10 report no pointer position: open at the focused element instead
		const keyboard = event.clientX === 0 && event.clientY === 0
		const box = (event.target as HTMLElement).getBoundingClientRect()
		setPoint(keyboard ? { x: box.left, y: box.bottom } : { x: event.clientX, y: event.clientY })
		onOpenChange?.(true)
	}

	return (
		<div onContextMenu={handleContextMenu} className={className}>
			{children}
			{/* a zero-size anchor at the pointer: the Menu is placed next to it */}
			<span
				ref={anchorRef}
				aria-hidden="true"
				style={{ position: 'fixed', left: point?.x ?? 0, top: point?.y ?? 0, width: 0, height: 0 }}
			/>
			<Menu
				items={items}
				label={label}
				anchorRef={anchorRef}
				placement="bottom-start"
				open={point !== null}
				onOpenChange={setOpen}
				look={look}
				linkComponent={linkComponent}
				linkProp={linkProp}
			/>
		</div>
	)
}

export default ContextMenu
