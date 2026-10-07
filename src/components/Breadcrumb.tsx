import type { ElementType, ReactNode } from 'react'

export interface BreadcrumbItem {
	label: ReactNode
	href?: string
}

export interface BreadcrumbProps {
	/** The last item is the current page. */
	items: BreadcrumbItem[]
	linkComponent?: ElementType
	linkProp?: string
	className?: string
}

/**
 * Trail of links ending in the current page. items: [{ label, href? }]; the last item is the current page.
 * `linkComponent` / `linkProp` swap in a router link, as in AppBar.
 */
const Breadcrumb = ({ items, linkComponent: Link = 'a', linkProp = 'href', className = '' }: BreadcrumbProps) => (
	<nav aria-label="Breadcrumb" className={className}>
		<ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-xs font-semibold uppercase tracking-widest">
			{items.map((item, index) => {
				const last = index === items.length - 1
				return (
					<li key={`${String(item.label)}-${index}`} className="flex items-center gap-2">
						{last || !item.href ? (
							<span aria-current={last ? 'page' : undefined} className={last ? 'text-app-text' : 'text-app-muted'}>
								{item.label}
							</span>
						) : (
							<Link {...{ [linkProp]: item.href }} className="text-app-muted transition hover:text-app-text">
								{item.label}
							</Link>
						)}
						{!last && (
							<span aria-hidden="true" className="text-app-border">
								/
							</span>
						)}
					</li>
				)
			})}
		</ol>
	</nav>
)

export default Breadcrumb
