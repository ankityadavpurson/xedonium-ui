import {
	useEffect,
	useMemo,
	useRef,
	useState,
	type ElementType,
	type KeyboardEvent,
	type MouseEvent,
	type ReactNode,
	type RefObject,
} from 'react'
import type { Placement } from '../types'
import Button from './Button'
import FloatingPanel from './FloatingPanel'
import type { ButtonVariant } from './buttonClass'
import ChevronRightIcon from './icons/ChevronRight'
import { ABSOLUTE, ItemBody, isExternalLink, type MenuLook } from './menuItemParts'

export type { MenuLook }

export interface MenuItem {
	key: string
	label?: ReactNode
	/** Shown before the label, hidden from screen readers. */
	icon?: ReactNode
	/** A keyboard shortcut hint shown at the end, e.g. `Ctrl+C` (display only). */
	shortcut?: string
	disabled?: boolean
	tone?: 'default' | 'warning' | 'danger'
	/** A smaller grey line under the label. */
	description?: ReactNode
	/** A short value at the end of the row, e.g. a count. */
	badge?: ReactNode
	/** Marks an item that opens a dialog (`aria-haspopup="dialog"`). */
	hasDialog?: boolean
	/** Makes the item a link (`<a href>`, or your `linkComponent`) instead of a button; `onClick` is then optional. Ignored when the item has `children`. */
	href?: string
	/** For link items: where to open it, e.g. `_blank` (which also adds `rel="noopener noreferrer"`). */
	target?: string
	/** Shows the external-link arrow. By default a link is external when it has `target="_blank"` or an absolute `http(s)://` address. */
	external?: boolean
	onClick?: () => void
	/** Makes the item open a submenu with these items. */
	children?: MenuItem[]
	/** A separator line instead of an item (only `key` is needed). */
	divider?: boolean
}

export interface MenuProps {
	items: MenuItem[]
	/** Content of the trigger button. Leave it out to anchor the menu to `anchorRef` instead. */
	trigger?: ReactNode
	/** Accessible name of the trigger and the menu. */
	label?: string
	variant?: ButtonVariant
	placement?: Placement
	/** Open state (controlled). */
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	/** Element the menu is placed next to when there is no trigger (a context menu, a custom button). */
	anchorRef?: RefObject<HTMLElement>
	/** `actions` gives the menu the look of ActionMenu (uppercase labels, ruled rows, a fixed width); `default` is the compact one. */
	look?: MenuLook
	/** Swap in a router link for items with an `href`, e.g. `linkComponent={Link} linkProp="to"` (as in Breadcrumb). */
	linkComponent?: ElementType
	linkProp?: string
	className?: string
}

interface PanelProps {
	items: MenuItem[]
	anchorRef: RefObject<HTMLElement>
	placement: Placement
	label?: string
	level: number
	/** Focus the first item when the panel appears (keyboard-opened menus; the root always does). */
	focusFirst: boolean
	/** Every open panel registers here so a click in any of them counts as inside the menu. */
	registry: Set<HTMLElement>
	/** Run when an item without a submenu is chosen. */
	onChoose: () => void
	/** Escape / ArrowLeft: close this level only (the root closes the whole menu). */
	onCloseLevel: () => void
	onCloseAll: () => void
	look: MenuLook
	linkComponent: ElementType
	linkProp: string
}

const TONES: Record<MenuLook, Record<'default' | 'warning' | 'danger', string>> = {
	default: {
		default: 'text-app-text',
		warning: 'text-amber-700 dark:text-amber-400',
		danger: 'text-red-700 dark:text-red-400',
	},
	actions: {
		default: 'text-app-text hover:bg-app-bg',
		warning: 'text-amber-700 hover:bg-amber-400/10 dark:text-amber-400',
		danger: 'text-red-700 hover:bg-red-500/10 focus-visible:bg-red-500/10 dark:text-red-400',
	},
}

const PANELS: Record<MenuLook, string> = {
	default: 'min-w-[12rem] max-w-[calc(100vw-1rem)] border border-app-border bg-app-card py-1 shadow-xl',
	actions: 'w-60 max-w-[calc(100vw-1rem)] overflow-hidden border border-app-border bg-app-card shadow-xl',
}

const ROWS: Record<MenuLook, string> = {
	default: 'gap-3 px-3 py-2 text-sm',
	actions: 'gap-2 border-b border-app-border bg-app-card px-3 py-2.5 last:border-b-0',
}

const enabledItems = (panel: HTMLElement | null) =>
	panel
		? Array.from(panel.children).filter((el): el is HTMLElement =>
				el.matches('[role="menuitem"]:not(:disabled):not([aria-disabled="true"])')
			)
		: []

const MenuPanel = ({
	items,
	anchorRef,
	placement,
	label,
	level,
	focusFirst,
	registry,
	onChoose,
	onCloseLevel,
	onCloseAll,
	look,
	linkComponent: Link,
	linkProp,
}: PanelProps) => {
	const panelRef = useRef<HTMLDivElement>(null)
	const [openKey, setOpenKey] = useState<string | null>(null)
	const [openedByKeyboard, setOpenedByKeyboard] = useState(false)
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const submenuAnchor = useMemo(() => ({ current: anchorEl }), [anchorEl])

	useEffect(() => {
		const panel = panelRef.current
		if (!panel) return undefined
		registry.add(panel)
		if (focusFirst) enabledItems(panel)[0]?.focus({ preventScroll: true })
		return () => {
			registry.delete(panel)
		}
		// runs once per panel: it is mounted when it opens and unmounted when it closes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const openSubmenu = (item: MenuItem, element: HTMLElement, byKeyboard: boolean) => {
		setAnchorEl(element)
		setOpenedByKeyboard(byKeyboard)
		setOpenKey(item.key)
	}

	const closeSubmenu = () => {
		setOpenKey(null)
		anchorEl?.focus({ preventScroll: true })
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const list = enabledItems(panelRef.current)
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
			case 'ArrowRight': {
				const item = items.find(i => i.key === document.activeElement?.getAttribute('data-key'))
				if (!item?.children?.length) return
				openSubmenu(item, document.activeElement as HTMLElement, true)
				break
			}
			case 'ArrowLeft':
				if (level === 0) return
				onCloseLevel()
				break
			case 'Escape':
				onCloseLevel()
				break
			case ' ':
				// buttons choose on Space natively; links only on Enter
				if (!(document.activeElement instanceof HTMLAnchorElement)) return
				document.activeElement.click()
				break
			case 'Tab':
				onCloseAll()
				return
			default:
				return
		}
		event.preventDefault()
		// Escape closes one level at a time: keep it from reaching the page's own Escape handlers
		event.nativeEvent.stopPropagation()
	}

	const activate = (item: MenuItem, event: MouseEvent<HTMLElement>) => {
		if (item.children?.length) {
			openSubmenu(item, event.currentTarget, event.detail === 0)
			return
		}
		item.onClick?.()
		onChoose()
	}

	const openItem = items.find(item => item.key === openKey)

	return (
		<>
			<FloatingPanel
				open
				anchorRef={anchorRef}
				panelRef={panelRef}
				placement={placement}
				gap={level === 0 ? 4 : 0}
				role="menu"
				aria-label={label}
				onKeyDown={handleKeyDown}
				className={PANELS[look]}
			>
				{items.map(item => {
					if (item.divider) {
						return (
							<div
								key={item.key}
								role="separator"
								className={look === 'actions' ? 'h-2 border-b border-app-border bg-app-bg' : 'my-1 h-px bg-app-border'}
							/>
						)
					}
					const hasChildren = !!item.children?.length
					const body = (
						<ItemBody
							icon={item.icon}
							label={item.label}
							description={item.description}
							badge={item.badge}
							external={!hasChildren && isExternalLink(item)}
							look={look}
						>
							{item.shortcut && <span className="shrink-0 text-xs text-app-muted">{item.shortcut}</span>}
							{hasChildren && (
								<span aria-hidden="true" className="shrink-0 text-app-muted">
									<ChevronRightIcon />
								</span>
							)}
						</ItemBody>
					)
					const className = `flex w-full items-center ${ROWS[look]} text-left outline-none transition focus:bg-app-bg ${
						TONES[look][item.tone ?? 'default']
					} ${openKey === item.key ? 'bg-app-bg' : ''}`
					const shared = {
						role: 'menuitem',
						'data-key': item.key,
						tabIndex: -1,
						onClick: (event: MouseEvent<HTMLElement>) => activate(item, event),
						onMouseEnter: (event: MouseEvent<HTMLElement>) => {
							if (item.disabled) return
							event.currentTarget.focus({ preventScroll: true })
							if (hasChildren) openSubmenu(item, event.currentTarget, false)
							else setOpenKey(null)
						},
					}
					if (item.href === undefined || hasChildren) {
						return (
							<button
								key={item.key}
								type="button"
								{...shared}
								disabled={item.disabled}
								aria-haspopup={hasChildren ? 'menu' : item.hasDialog ? 'dialog' : undefined}
								aria-expanded={hasChildren ? openKey === item.key : undefined}
								className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}
							>
								{body}
							</button>
						)
					}
					// A disabled link has nowhere to go: a plain <a> without an href keeps the layout and is skipped by the keys
					if (item.disabled) {
						return (
							<a
								key={item.key}
								role="menuitem"
								aria-disabled="true"
								className={`${className} cursor-not-allowed opacity-50`}
							>
								{body}
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
							{...shared}
							aria-haspopup={item.hasDialog ? 'dialog' : undefined}
							className={className}
						>
							{body}
						</Anchor>
					)
				})}
			</FloatingPanel>
			{openItem?.children && (
				<MenuPanel
					items={openItem.children}
					anchorRef={submenuAnchor as RefObject<HTMLElement>}
					placement="right-start"
					label={typeof openItem.label === 'string' ? openItem.label : undefined}
					level={level + 1}
					focusFirst={openedByKeyboard}
					registry={registry}
					onChoose={onChoose}
					onCloseLevel={closeSubmenu}
					onCloseAll={onCloseAll}
					look={look}
					linkComponent={Link}
					linkProp={linkProp}
				/>
			)}
		</>
	)
}

/**
 * A menu of actions that opens from a trigger button, with icons, shortcuts, dividers and nested submenus (give an
 * item `children`). Arrow keys move, Home / End jump, Enter or Space chooses, Right opens a submenu and Left or Escape
 * closes it (Escape on the top level closes the menu and returns focus to the trigger). Hovering an item with a submenu
 * opens it. Outside clicks close everything. Without a `trigger`, pass `anchorRef` and control `open` yourself
 * (a context menu, a custom button). Items take the same fields as ActionMenu (`description`, `badge`, `href`,
 * `tone`, `hasDialog`); `look="actions"` gives the menu ActionMenu's appearance, so the two can sit side by side.
 * Use ActionMenu for a plain, flat list of page actions.
 */
const Menu = ({
	items,
	trigger,
	label,
	variant = 'secondary',
	placement = 'bottom-start',
	open,
	defaultOpen = false,
	onOpenChange,
	anchorRef,
	look = 'default',
	linkComponent = 'a',
	linkProp = 'href',
	className = '',
}: MenuProps) => {
	const [inner, setInner] = useState(defaultOpen)
	const isOpen = open ?? inner
	const rootRef = useRef<HTMLDivElement>(null)
	const registry = useRef(new Set<HTMLElement>()).current

	const setOpen = (next: boolean) => {
		if (open === undefined) setInner(next)
		onOpenChange?.(next)
	}
	const close = (returnFocus: boolean) => {
		setOpen(false)
		if (returnFocus) rootRef.current?.querySelector('button')?.focus()
	}

	useEffect(() => {
		if (!isOpen) return undefined
		const onPointerDown = (event: globalThis.MouseEvent) => {
			const target = event.target as Node
			const inside =
				rootRef.current?.contains(target) ||
				anchorRef?.current?.contains(target) ||
				[...registry].some(panel => panel.contains(target))
			if (!inside) setOpen(false)
		}
		document.addEventListener('mousedown', onPointerDown)
		return () => document.removeEventListener('mousedown', onPointerDown)
		// setOpen only reads props that are stable while the menu is open
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen])

	return (
		<div ref={rootRef} className={`relative inline-block ${className}`}>
			{trigger !== undefined && (
				<Button
					variant={variant}
					aria-label={label}
					aria-haspopup="menu"
					aria-expanded={isOpen}
					onClick={() => setOpen(!isOpen)}
				>
					{trigger}
				</Button>
			)}
			{isOpen && (
				<MenuPanel
					items={items}
					anchorRef={anchorRef ?? (rootRef as RefObject<HTMLElement>)}
					placement={placement}
					label={label}
					level={0}
					focusFirst
					registry={registry}
					onChoose={() => close(true)}
					onCloseLevel={() => close(true)}
					onCloseAll={() => close(false)}
					look={look}
					linkComponent={linkComponent}
					linkProp={linkProp}
				/>
			)}
		</div>
	)
}

export default Menu
