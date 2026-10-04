/**
 * Plain horizontal navigation bar (not sticky, no theme toggle; use AppBar for the full app header).
 * links: [{ href, label, active?, ...extraLinkProps }]. `linkComponent` / `linkProp` swap in a router link.
 */
const Navbar = ({ brand, links = [], actions, linkComponent: Link = 'a', linkProp = 'href', label = 'Main', className = '' }) => (
	<nav aria-label={label} className={`flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-app-border bg-app-card px-4 py-3 ${className}`}>
		{brand && <div className="text-sm font-bold tracking-tight text-app-text">{brand}</div>}
		<ul className="m-0 flex flex-1 list-none flex-wrap items-center gap-1 p-0">
			{links.map(({ href, label: text, active, ...extra }) => (
				<li key={text}>
					<Link
						{...{ [linkProp]: href }}
						aria-current={active ? 'page' : undefined}
						className={`px-2.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
							active ? 'bg-app-strong text-app-bg' : 'text-app-muted hover:text-app-text'
						}`}
						{...extra}
					>
						{text}
					</Link>
				</li>
			))}
		</ul>
		{actions && <div className="flex items-center gap-2">{actions}</div>}
	</nav>
)

export default Navbar
