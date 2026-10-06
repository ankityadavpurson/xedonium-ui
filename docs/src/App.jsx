import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
	AppShell,
	Button,
	CommandPalette,
	FanFavicon,
	Sidebar,
	ThemeToggle,
	Tooltip,
	buildFaviconHref,
	useKeyboardShortcuts,
	useTheme,
} from 'xedonium'
import VersionBadge from './components/VersionBadge'
import { categories, pages, pathOf } from './content'
import { foundations } from './pages/foundations'
import CategoryPage from './pages/CategoryPage'
import ComponentPage from './pages/ComponentPage'
import GettingStarted from './pages/GettingStarted'
import Home from './pages/Home'
import Hooks from './pages/Hooks'
import LoadingScreenPreview from './pages/LoadingScreenPreview'
import NotFound from './pages/NotFound'

// The Playground compiles JSX in the browser (react-live); load it only when someone opens it
const Playground = lazy(() => import('./pages/Playground'))

const GitHubIcon = () => (
	<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
		<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
	</svg>
)

const Logo = () => {
	const { activeTheme } = useTheme()
	return <img src={buildFaviconHref(activeTheme)} alt="" width={22} height={22} />
}

// Router links for the library's Sidebar (it spreads `to` onto whatever linkComponent renders)
const RouterLink = ({ to, ...rest }) => <NavLink to={to} end {...rest} />

const useNavItems = navigate =>
	useMemo(
		() => [
			{ key: '/getting-started', label: 'Getting started', href: '/getting-started' },
			{
				key: 'foundations',
				label: 'Foundations',
				onClick: () => navigate(foundations[0].path),
				children: foundations.map(f => ({ key: f.path, label: f.title, href: f.path })),
			},
			...categories.map(category => ({
				key: `/components/${category.slug}`,
				label: category.label,
				onClick: () => navigate(`/components/${category.slug}`),
				children: category.components.map(component => ({
					key: pathOf(category, component),
					label: component.name,
					href: pathOf(category, component),
				})),
			})),
			{ key: '/hooks', label: 'Hooks & theme', href: '/hooks' },
			{ key: '/playground', label: 'Playground', href: '/playground' },
		],
		[navigate]
	)

const App = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [searchOpen, setSearchOpen] = useState(false)
	const items = useNavItems(navigate)

	useKeyboardShortcuts({ 'mod+k': () => setSearchOpen(true), '/': () => setSearchOpen(true) })

	// The shell scrolls its <main>, not the window, so reset it (and the title) on navigation
	useEffect(() => {
		document.querySelector('main')?.scrollTo(0, 0)
	}, [pathname])

	const commands = useMemo(
		() => [
			{ key: 'start', label: 'Getting started', group: 'Guides', onSelect: () => navigate('/getting-started') },
			...foundations.map(f => ({
				key: f.path,
				label: f.title,
				group: 'Foundations',
				onSelect: () => navigate(f.path),
			})),
			...pages.map(({ category, component }) => ({
				key: pathOf(category, component),
				label: component.name,
				group: category.label,
				onSelect: () => navigate(pathOf(category, component)),
			})),
			{ key: 'hooks', label: 'Hooks & theme', group: 'Guides', onSelect: () => navigate('/hooks') },
			{ key: 'playground', label: 'Playground', group: 'Guides', onSelect: () => navigate('/playground') },
		],
		[navigate]
	)

	const header = (
		<div className="flex items-center gap-3">
			<Link to="/" className="flex min-h-9 items-center gap-2 text-sm font-bold tracking-tight text-app-text">
				<Logo />
				<span className="hidden min-[360px]:inline">Xedonium</span>
			</Link>
			<VersionBadge className="hidden sm:inline-block" />
			<span className="flex-1" />
			<Button
				variant="secondary"
				onClick={() => setSearchOpen(true)}
				aria-label="Search the docs"
				tooltip="Search the docs (Ctrl K)"
				tooltipPlacement="bottom-end"
			>
				Search <span className="ml-1 hidden text-app-muted sm:inline">Ctrl K</span>
			</Button>
			<Tooltip text="View on GitHub" placement="bottom-end">
				<a
					href="https://github.com/ankityadavpurson/xedonium-ui"
					aria-label="Xedonium on GitHub"
					className="flex shrink-0 items-center justify-center border border-app-border bg-app-bg px-3 py-2 text-app-soft transition hover:border-app-strong hover:text-app-text"
				>
					<GitHubIcon />
				</a>
			</Tooltip>
			<ThemeToggle />
		</div>
	)

	// Whole-page previews have no docs chrome
	if (pathname.startsWith('/preview/')) {
		return (
			<Routes>
				<Route path="/preview/loading-screen" element={<LoadingScreenPreview />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		)
	}

	return (
		<>
			<AppShell
				header={header}
				sidebarTitle="Docs"
				sidebar={close => (
					<Sidebar
						label="Documentation"
						items={items}
						activeKey={pathname}
						linkComponent={RouterLink}
						linkProp="to"
						onSelect={close}
						className="w-64"
						footer={
							<div className="flex items-center justify-between gap-2">
								<span className="text-[10px] font-semibold uppercase tracking-widest text-app-muted">xedonium</span>
								<VersionBadge />
							</div>
						}
					/>
				)}
			>
				<div className="mx-auto w-full max-w-4xl">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/getting-started" element={<GettingStarted />} />
						{foundations.map(f => (
							<Route key={f.path} path={f.path} element={<f.Page />} />
						))}
						<Route path="/components/:category" element={<CategoryPage />} />
						<Route path="/components/:category/:slug" element={<ComponentPage />} />
						<Route path="/hooks" element={<Hooks />} />
						<Route
							path="/playground"
							element={
								<Suspense
									fallback={
										<div className="flex justify-center py-24">
											<FanFavicon label="Loading the playground" />
										</div>
									}
								>
									<Playground />
								</Suspense>
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</AppShell>
			<CommandPalette
				open={searchOpen}
				onClose={() => setSearchOpen(false)}
				commands={commands}
				placeholder="Search components and guides…"
			/>
		</>
	)
}

export default App
