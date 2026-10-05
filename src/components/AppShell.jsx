import { useEffect, useState } from 'react'
import Button from './Button'
import Drawer from './Drawer'
import MenuIcon from './icons/Menu'

/**
 * Application frame: header on top, `sidebar` on the left, scrolling `children` as the main area.
 * Below the `md` breakpoint the sidebar moves into a Drawer opened from a menu button in the header.
 * The drawer closes by itself when the window grows to the `md` breakpoint, where the sidebar is shown inline.
 * `sidebar` may be a node, or a function `(close) => node` if it should close the drawer on selection.
 */
const AppShell = ({ header, sidebar, sidebarTitle = 'Menu', children, className = '' }) => {
	const [open, setOpen] = useState(false)
	const close = () => setOpen(false)

	// Resizing up to the desktop layout shows the sidebar inline, so a lingering drawer must not stay open
	useEffect(() => {
		const query = window.matchMedia('(min-width: 768px)')
		const onChange = event => event.matches && setOpen(false)
		query.addEventListener('change', onChange)
		return () => query.removeEventListener('change', onChange)
	}, [])

	const sidebarNode = typeof sidebar === 'function' ? sidebar(close) : sidebar

	return (
		<div className={`flex h-screen flex-col bg-app-bg text-app-text ${className}`}>
			<header className="flex shrink-0 items-center gap-3 border-b border-app-border bg-app-card px-4 py-2">
				{sidebar && (
					<span className="md:hidden">
						<Button variant="secondary" aria-label="Open menu" onClick={() => setOpen(true)}>
							<MenuIcon />
						</Button>
					</span>
				)}
				<div className="min-w-0 flex-1">{header}</div>
			</header>
			<div className="flex min-h-0 flex-1">
				{sidebar && <aside className="hidden shrink-0 md:block">{sidebarNode}</aside>}
				<main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
			</div>
			{sidebar && (
				<Drawer open={open} onClose={close} title={sidebarTitle} side="left" width="max-w-xs" padded={false}>
					{/* fill the drawer: the sidebar's own fixed width and right border would leave a stray line */}
					<div className="flex min-h-0 flex-1 flex-col [&>nav]:min-h-0 [&>nav]:w-full [&>nav]:flex-1 [&>nav]:border-r-0">
						{typeof sidebar === 'function' ? sidebar(close) : sidebar}
					</div>
				</Drawer>
			)}
		</div>
	)
}

export default AppShell
