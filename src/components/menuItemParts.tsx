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
