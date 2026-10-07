import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import ThemeToggle from './ThemeToggle'

export interface AppBarLink extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
	href: string
	label: ReactNode
	active?: boolean
}

export interface AppBarProps {
	brand?: ReactNode
	logo?: ReactNode
	brandHref?: string
	links?: AppBarLink[]
	actions?: ReactNode
	/** Show the theme toggle (default true). */
	themeToggle?: boolean
	hideBrandOnMobile?: boolean
	/** Swap in a router link, e.g. `linkComponent={Link} linkProp="to"`. */
	linkComponent?: ElementType
	linkProp?: string
	/** A Tailwind `max-w-*` class. */
	maxWidth?: string
	/**
	 * Render just the row, with no outer `<header>` frame (no sticky, border, background or padding). Use it inside
	 * `AppShell`'s `header`, which already provides the frame.
	 */
	embedded?: boolean
}

const linkClass = (active: boolean) =>
	`flex min-h-9 items-center px-2.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition sm:px-3 ${
		active ? 'bg-app-card text-app-text' : 'text-app-muted hover:text-app-text'
	}`

/**
 * Sticky top bar: brand on the left, optional navigation, theme toggle and extra actions on the right.
 * links: [{ href, label, active?, ...extraLinkProps }].
 * Pass `embedded` when placing it inside `AppShell`'s `header`, to avoid a double frame.
 * `linkComponent` swaps in a router link; `linkProp` names its destination prop (e.g. "to" for react-router).
 */
const AppBar = ({
	brand,
	logo,
	brandHref = '/',
	links = [],
	actions,
	themeToggle = true,
	hideBrandOnMobile = false,
	linkComponent: Link = 'a',
	linkProp = 'href',
	maxWidth = 'max-w-5xl',
	embedded = false,
}: AppBarProps) => {
	const Frame = embedded ? 'div' : 'header'
	return (
		<Frame className={embedded ? undefined : 'sticky top-0 z-40 border-b border-app-border bg-app-bg/95 backdrop-blur'}>
			<div
				className={
					embedded
						? 'flex w-full items-center justify-between gap-3'
						: `mx-auto flex h-14 w-full ${maxWidth} items-center justify-between gap-3 px-4`
				}
			>
				<Link {...{ [linkProp]: brandHref }} className="flex min-h-9 shrink-0 items-center gap-2 text-app-text">
					{logo}
					<span className={`text-base font-bold tracking-tight ${hideBrandOnMobile ? 'hidden sm:inline' : ''}`}>
						{brand}
					</span>
				</Link>

				{links.length > 0 && (
					<nav aria-label="Main" className="flex min-w-0 items-center gap-1 overflow-x-auto">
						{links.map(({ href, label, active = false, ...linkProps }) => (
							<Link
								key={href}
								{...{ [linkProp]: href }}
								aria-current={active ? 'page' : undefined}
								className={linkClass(active)}
								{...linkProps}
							>
								{label}
							</Link>
						))}
					</nav>
				)}

				<div className="flex shrink-0 items-center gap-1">
					{themeToggle && <ThemeToggle variant="toolbar" />}
					{actions}
				</div>
			</div>
		</Frame>
	)
}

export default AppBar
