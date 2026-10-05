import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
	AppShell,
	Button,
	CommandPalette,
	Sidebar,
	ThemeToggle,
	buildFaviconHref,
	useKeyboardShortcuts,
	useTheme,
} from 'xedonium'
import { categories, pages, pathOf } from './content'
import { foundations } from './pages/foundations'
import CategoryPage from './pages/CategoryPage'
import ComponentPage from './pages/ComponentPage'
import GettingStarted from './pages/GettingStarted'
import Home from './pages/Home'
import Hooks from './pages/Hooks'
import NotFound from './pages/NotFound'
import Playground from './pages/Playground'

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
			<Link to="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-app-text">
				<Logo />
				Xedonium
			</Link>
			<span className="flex-1" />
			<Button variant="secondary" onClick={() => setSearchOpen(true)} aria-label="Search the docs">
				Search <span className="ml-1 hidden text-app-muted sm:inline">Ctrl K</span>
			</Button>
			<a
				href="https://github.com/ankityadavpurson/xedonium-ui"
				className="hidden text-xs font-semibold uppercase tracking-widest text-app-muted transition hover:text-app-text sm:inline"
			>
				GitHub
			</a>
			<ThemeToggle />
		</div>
	)

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
						<Route path="/playground" element={<Playground />} />
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
