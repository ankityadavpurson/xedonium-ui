// Page title with that page's own actions; app-wide navigation lives in AppBar
const PageHeader = ({ title, subtitle, children }) => (
	<div className="mb-6 flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 className="text-2xl font-bold tracking-tight text-app-text sm:text-3xl">{title}</h1>
			{subtitle && <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-app-muted">{subtitle}</p>}
		</div>
		{children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
	</div>
)

export default PageHeader
