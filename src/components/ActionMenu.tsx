import { useEffect, useId, useRef, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react'
import type { Placement } from '../types'
import useDismissable from '../hooks/useDismissable'
import Button from './Button'
import FloatingPanel from './FloatingPanel'
import ArrowUpRightIcon from './icons/ArrowUpRight'
import type { ButtonVariant } from './buttonClass'

export interface ActionMenuItem {
	key: string
	label: ReactNode
	/** A decorative icon before the label (hidden from screen readers). */
	icon?: ReactNode
	description?: ReactNode
	badge?: ReactNode
	tone?: 'default' | 'warning' | 'danger'
	disabled?: boolean
	/** Marks an item that opens a dialog (`aria-haspopup`). */
	hasDialog?: boolean
	/** Makes the item a link (`<a href>`, or your `linkComponent`) instead of a button; `onClick` is then optional. */
	href?: string
	/** For link items: where to open it, e.g. `_blank` (which also adds `rel="noopener noreferrer"`). */
	target?: string
	/** Shows the external-link arrow. By default a link is external when it has `target="_blank"` or an absolute `http(s)://` address. */
	external?: boolean
	onClick?: () => void
}

export interface ActionMenuProps {
	/** Accessible name of the trigger and the menu. */
	label?: string
	/** Content of the trigger button. */
	trigger: ReactNode
	variant?: ButtonVariant
	items: ActionMenuItem[]
	placement?: Placement
	/** Swap in a router link for items with an `href`, e.g. `linkComponent={Link} linkProp="to"` (as in Breadcrumb). */
	linkComponent?: ElementType
	linkProp?: string
	className?: string
}

// "https://...", "//host", "mailto:...": not a path inside the app
const ABSOLUTE = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

const TONES: Record<'default' | 'warning' | 'danger', string> = {
	default: 'text-app-text hover:bg-app-bg',
	warning: 'text-amber-700 hover:bg-amber-400/10 dark:text-amber-400',
	danger: 'text-red-700 hover:bg-red-500/10 focus-visible:bg-red-500/10 dark:text-red-400',
}

/**
 * Dropdown of page actions. Closes on outside click and Escape (focus returns to the trigger).
 * The menu is portalled to <body>, so scroll containers and overflow: hidden ancestors can't clip it.
 * items: [{ key, label, icon?, description?, badge?, tone?, disabled?, hasDialog?, href?, onClick? }]
 * Opening the menu focuses its first item; Arrow Up / Down, Home and End move between items, Enter or Space chooses, and Tab closes it.
 * A link to another site (`target="_blank"` or an absolute http(s) address, or `external`) shows an arrow.
 * An item with an `href` is a real link (middle-click, "copy link address", announced as a link) that also closes the menu; `linkComponent` / `linkProp` swap in a router link for site paths (absolute URLs stay plain anchors).
 * `tone` is `default`, `warning` or `danger` (red text and icon, for destructive items such as Delete).
 * `trigger` is the button content; `variant` styles the trigger (e.g. 'warning' to flag pending work).
 * `placement` is where the menu opens (default "bottom-start"; e.g. "bottom-end", "top-start"). It flips above or to the other edge when there is no room, and re-adjusts on scroll and resize.
 */
const ActionMenu = ({
	label,
	trigger,
	variant = 'secondary',
	items,
	placement = 'bottom-start',
	linkComponent: Link = 'a',
	linkProp = 'href',
	className = '',
}: ActionMenuProps) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const menuId = useId()

	useDismissable(open, [rootRef, panelRef], reason => {
		setOpen(false)
		if (reason === 'escape') rootRef.current?.querySelector('button')?.focus()
	})

	const enabledItems = () =>
		Array.from(
			panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled):not([aria-disabled="true"])') ??
				[]
		)

	// The panel is portalled to <body>, so Tab from the trigger would not reach it: move focus in when it opens
	useEffect(() => {
		if (open) enabledItems()[0]?.focus({ preventScroll: true })
	}, [open])

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const list = enabledItems()
		const index = list.indexOf(document.activeElement as HTMLElement)
		const focusAt = (i: number) => list[(i + list.length) % list.length]?.focus({ preventScroll: true })
		switch (event.key) {
			case 'ArrowDown':
				focusAt(index + 1)
				break
			case 'ArrowUp':
				focusAt(index < 0 ? list.length - 1 : index - 1)
				break
			case 'Home':
				focusAt(0)
				break
			case 'End':
				focusAt(list.length - 1)
				break
			case ' ':
				// buttons choose on Space natively; links only on Enter
				if (document.activeElement instanceof HTMLAnchorElement) document.activeElement.click()
				break
			case 'Tab':
				// leave the menu: the trigger takes focus, so the Tab moves on from there
				setOpen(false)
				rootRef.current?.querySelector('button')?.focus()
				return
			default:
				return
		}
		event.preventDefault()
	}

	const run = (item: ActionMenuItem) => {
		setOpen(false)
		item.onClick?.()
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
				onKeyDown={handleKeyDown}
				aria-label={label}
				className="w-60 max-w-[calc(100vw-1rem)] overflow-hidden border border-app-border bg-app-card shadow-lg"
			>
				{items.map(item => {
					const external =
						item.href !== undefined &&
						(item.external ?? (item.target === '_blank' || /^(?:https?:)?\/\//i.test(item.href)))
					const content = (
						<>
							{item.icon && (
								<span aria-hidden="true" className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">
									{item.icon}
								</span>
							)}
							<span className="min-w-0 flex-1">
								<span className="block text-xs font-medium uppercase tracking-widest">{item.label}</span>
								{item.description && (
									<span className="mt-0.5 block text-xs normal-case tracking-normal text-app-muted">
										{item.description}
									</span>
								)}
							</span>
							{item.badge != null && <span className="font-mono text-xs">{item.badge}</span>}
							{external && <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0" />}
						</>
					)
					const itemClass = `flex w-full items-center gap-2 border-b border-app-border bg-app-card px-3 py-2.5 text-left transition last:border-b-0 ${TONES[item.tone || 'default']}`
					if (item.href === undefined) {
						return (
							<button
								key={item.key}
								type="button"
								role="menuitem"
								disabled={item.disabled}
								aria-haspopup={item.hasDialog ? 'dialog' : undefined}
								onClick={() => run(item)}
								className={`${itemClass} disabled:cursor-not-allowed disabled:opacity-50`}
							>
								{content}
							</button>
						)
					}
					// A disabled link has nowhere to go: a plain <a> without an href keeps the layout and is skipped by Tab
					if (item.disabled) {
						return (
							<a
								key={item.key}
								role="menuitem"
								aria-disabled="true"
								className={`${itemClass} cursor-not-allowed opacity-50`}
							>
								{content}
							</a>
						)
					}
					// Only site paths go through the router link; other sites and mailto: / tel: stay plain anchors
					const plain = ABSOLUTE.test(item.href)
					const Anchor = plain ? 'a' : Link
					return (
						<Anchor
							key={item.key}
							{...{ [plain ? 'href' : linkProp]: item.href }}
							target={item.target}
							rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
							role="menuitem"
							onClick={() => run(item)}
							className={itemClass}
						>
							{content}
						</Anchor>
					)
				})}
			</FloatingPanel>
		</div>
	)
}

export default ActionMenu
