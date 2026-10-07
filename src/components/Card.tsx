import type { ReactNode } from 'react'

export interface CardProps {
	title?: ReactNode
	subtitle?: ReactNode
	/** Controls shown at the right of the header. */
	actions?: ReactNode
	footer?: ReactNode
	/** Pad the body (default true). */
	padded?: boolean
	className?: string
	children?: ReactNode
}

/**
 * Bordered surface with optional header (title + actions) and footer. On narrow screens the header wraps, moving
 * `actions` below a long title / subtitle instead of squeezing the text.
 */
const Card = ({ title, subtitle, actions, footer, padded = true, className = '', children }: CardProps) => (
	<section className={`flex flex-col border border-app-border bg-app-card ${className}`}>
		{(title || actions) && (
			<header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-app-border px-5 py-3">
				<div className="min-w-[12rem] flex-1">
					{title && <h3 className="m-0 text-sm font-semibold uppercase tracking-widest text-app-text">{title}</h3>}
					{subtitle && <p className="m-0 mt-0.5 text-xs text-app-muted">{subtitle}</p>}
				</div>
				{actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
			</header>
		)}
		<div className={`flex-1 text-sm text-app-text ${padded ? 'p-5' : ''}`}>{children}</div>
		{footer && <footer className="border-t border-app-border px-5 py-3 text-sm">{footer}</footer>}
	</section>
)

export default Card
