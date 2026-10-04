/** Bordered surface with optional header (title + actions) and footer. */
const Card = ({ title, subtitle, actions, footer, padded = true, className = '', children }) => (
	<section className={`flex flex-col border border-app-border bg-app-card ${className}`}>
		{(title || actions) && (
			<header className="flex items-center justify-between gap-3 border-b border-app-border px-5 py-3">
				<div className="min-w-0">
					{title && <h3 className="m-0 text-sm font-semibold uppercase tracking-widest text-app-text">{title}</h3>}
					{subtitle && <p className="m-0 mt-0.5 text-xs text-app-muted">{subtitle}</p>}
				</div>
				{actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
			</header>
		)}
		<div className={`flex-1 text-sm text-app-text ${padded ? 'p-5' : ''}`}>{children}</div>
		{footer && <footer className="border-t border-app-border px-5 py-3 text-sm">{footer}</footer>}
	</section>
)

export default Card
