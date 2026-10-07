import { useEffect, useState, type ReactNode } from 'react'
import Button, { type ButtonProps } from './Button'
import type { ButtonVariant } from './buttonClass'
import Drawer from './Drawer'
import MenuIcon from './icons/Menu'
import useMediaQuery from '../hooks/useMediaQuery'

export interface AppShellSidebarContext {
	/** True when rendered inside the mobile Drawer. */
	inDrawer: boolean
	/** True when rendered as the icon rail (see `sidebarCollapsedBelow`). */
	collapsed: boolean
}

export interface AppShellProps {
	header?: ReactNode
	/**
	 * A node, or `(close, { inDrawer, collapsed }) => node` to close the drawer on selection and to know where it is
	 * rendered (e.g. pass `collapsed` to `Sidebar`).
	 */
	sidebar?: ReactNode | ((close: () => void, context: AppShellSidebarContext) => ReactNode)
	/** Show the inline sidebar as an icon rail (`collapsed: true`) between `md` and this breakpoint. */
	sidebarCollapsedBelow?: 'lg'
	/** Title of the drawer shown on small screens. */
	sidebarTitle?: string
	/** Variant of the mobile menu button (default `secondary`). */
	menuButtonVariant?: ButtonVariant
	/** Extra props for the mobile menu button, e.g. `className` or `aria-label` (default "Open menu"). */
	menuButtonProps?: Omit<ButtonProps, 'variant' | 'children'>
	children?: ReactNode
	className?: string
}

/**
 * Application frame: header on top, `sidebar` on the left, scrolling `children` as the main area.
 * Below the `md` breakpoint the sidebar moves into a Drawer opened from a menu button in the header.
 * The drawer closes by itself when the window grows to the `md` breakpoint, where the sidebar is shown inline.
 * `sidebar` may be a node, or a function `(close, { inDrawer, collapsed }) => node` if it should close the drawer on
 * selection or adapt to where it is rendered. `sidebarCollapsedBelow="lg"` shows an icon rail between `md` and `lg`
 * (the render function receives `collapsed: true` there; render a `Sidebar collapsed={collapsed}`).
 * `menuButtonVariant` / `menuButtonProps` customise the menu button so it can match the header's other buttons.
 */
const AppShell = ({
	header,
	sidebar,
	sidebarTitle = 'Menu',
	sidebarCollapsedBelow,
	menuButtonVariant = 'secondary',
	menuButtonProps,
	children,
	className = '',
}: AppShellProps) => {
	const [open, setOpen] = useState(false)
	const close = () => setOpen(false)
	const wide = useMediaQuery('(min-width: 1024px)')
	const collapsed = sidebarCollapsedBelow === 'lg' && !wide

	// Resizing up to the desktop layout shows the sidebar inline, so a lingering drawer must not stay open
	useEffect(() => {
		const query = window.matchMedia('(min-width: 768px)')
		const onChange = (event: MediaQueryListEvent) => event.matches && setOpen(false)
		query.addEventListener('change', onChange)
		return () => query.removeEventListener('change', onChange)
	}, [])

	const sidebarNode = typeof sidebar === 'function' ? sidebar(close, { inDrawer: false, collapsed }) : sidebar

	return (
		<div className={`relative flex h-screen flex-col overflow-hidden bg-app-bg text-app-text ${className}`}>
			<header className="flex shrink-0 items-center gap-3 border-b border-app-border bg-app-card px-4 py-2">
				{sidebar && (
					<span className="md:hidden">
						<Button
							variant={menuButtonVariant}
							aria-label="Open menu"
							{...menuButtonProps}
							onClick={event => {
								menuButtonProps?.onClick?.(event)
								setOpen(true)
							}}
						>
							<MenuIcon />
						</Button>
					</span>
				)}
				<div className="min-w-0 flex-1">{header}</div>
			</header>
			<div className="flex min-h-0 flex-1">
				{sidebar && <aside className="hidden shrink-0 md:block">{sidebarNode}</aside>}
				<main className="relative min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
			</div>
			{sidebar && (
				<Drawer open={open} onClose={close} title={sidebarTitle} side="left" width="max-w-xs" padded={false}>
					{/* fill the drawer: the sidebar's own fixed width and right border would leave a stray line */}
					<div className="flex min-h-0 flex-1 flex-col [&>nav]:min-h-0 [&>nav]:w-full [&>nav]:flex-1 [&>nav]:border-r-0">
						{typeof sidebar === 'function' ? sidebar(close, { inDrawer: true, collapsed: false }) : sidebar}
					</div>
				</Drawer>
			)}
		</div>
	)
}

export default AppShell
