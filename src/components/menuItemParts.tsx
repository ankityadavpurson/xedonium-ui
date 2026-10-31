import type { ReactNode } from 'react'
import ArrowUpRightIcon from './icons/ArrowUpRight'

/** `default` is the compact sentence-case menu; `actions` matches ActionMenu (uppercase labels, ruled rows). */
export type MenuLook = 'default' | 'actions'

// "https://...", "//host", "mailto:...": not a path inside the app
export const ABSOLUTE = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

/** Whether a link item points to another site: `external` decides when set, else `target="_blank"` or an http(s) address. */
export const isExternalLink = ({ href, target, external }: { href?: string; target?: string; external?: boolean }) =>
	href !== undefined && (external ?? (target === '_blank' || /^(?:https?:)?\/\//i.test(href)))

interface ItemBodyProps {
	icon?: ReactNode
	label?: ReactNode
	description?: ReactNode
	badge?: ReactNode
	external?: boolean
	look: MenuLook
	/** Content after the arrow (a shortcut hint, a submenu chevron). */
	children?: ReactNode
}

/** What a menu row shows: icon, label with an optional description, badge and the external-link arrow. */
export const ItemBody = ({ icon, label, description, badge, external, look, children }: ItemBodyProps) => (
	<>
		{icon && (
			<span aria-hidden="true" className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">
				{icon}
			</span>
		)}
		<span className="min-w-0 flex-1">
			<span className={look === 'actions' ? 'block text-xs font-medium uppercase tracking-widest' : 'block truncate'}>
				{label}
			</span>
			{description && (
				<span
					className={`mt-0.5 block text-xs normal-case tracking-normal text-app-muted ${look === 'actions' ? '' : 'truncate'}`}
				>
					{description}
				</span>
			)}
		</span>
		{badge != null && <span className="shrink-0 font-mono text-xs">{badge}</span>}
		{external && <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0" />}
		{children}
	</>
)

interface GroupableItem<T> {
	key: string
	label?: ReactNode
	heading?: ReactNode
	divider?: boolean
	/** A group: the label is its heading and these are its items. */
	items?: T[]
}

export type ItemGroup<T> =
	{ kind: 'divider'; item: T } | { kind: 'items'; key?: string; title?: ReactNode; items: T[]; nested?: boolean }

/**
 * Splits an item list into the pieces a menu renders: dividers and groups. A group is either an item with `items`, or the
 * run of items that follows a `heading` item (up to the next heading or divider). Items before the first heading are loose.
 */
export const groupItems = <T extends GroupableItem<T>>(items: T[]): ItemGroup<T>[] => {
	const groups: ItemGroup<T>[] = []
	let current: Extract<ItemGroup<T>, { kind: 'items' }> | null = null
	for (const item of items) {
		if (item.divider) {
			current = null
			groups.push({ kind: 'divider', item })
		} else if (item.items) {
			current = null
			groups.push({ kind: 'items', key: item.key, title: item.heading ?? item.label, items: item.items, nested: true })
		} else if (item.heading != null) {
			current = { kind: 'items', key: item.key, title: item.heading, items: [] }
			groups.push(current)
		} else {
			if (!current) {
				current = { kind: 'items', items: [] }
				groups.push(current)
			}
			current.items.push(item)
		}
	}
	return groups
}

/** Every item that can be focused or opened, with the items of groups pulled up to one list. */
export const flattenItems = <T extends GroupableItem<T>>(items: T[]): T[] =>
	items.flatMap(item => (item.items ? flattenItems(item.items) : [item]))

const GROUP_CLASS: Record<MenuLook, string> = {
	default: '',
	actions: 'border-t border-app-border first:border-t-0',
}

const HEADING_CLASS: Record<MenuLook, string> = {
	default: 'px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wider text-app-muted',
	actions:
		'border-b border-app-border bg-app-bg px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-app-muted',
}

interface ItemGroupProps {
	heading: ReactNode
	id: string
	look: MenuLook
	children: ReactNode
}

/** A labelled run of items: the heading is plain text for assistive technology, not a menu item. */
export const MenuGroup = ({ heading, id, look, children }: ItemGroupProps) => (
	<div role="group" aria-labelledby={id} className={GROUP_CLASS[look]}>
		<div id={id} role="presentation" className={HEADING_CLASS[look]}>
			{heading}
		</div>
		{children}
	</div>
)
