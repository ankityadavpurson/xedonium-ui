import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from 'xedonium'

/** Previous / next card at the bottom of a docs page; renders an empty spacer without a `to`. */
const Neighbour = ({ to, name, label, align, next = false }) =>
	to ? (
		<Link
			to={to}
			className={`flex min-w-0 flex-1 flex-col gap-1 break-words border border-app-border bg-app-card p-4 transition hover:border-app-strong ${align}`}
		>
			<span
				className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-app-muted ${next ? 'justify-end' : ''}`}
			>
				{!next && <ArrowLeftIcon />}
				{label}
				{next && <ArrowLeftIcon className="h-3.5 w-3.5 rotate-180" />}
			</span>
			<span className={`text-sm font-semibold text-app-text ${next ? 'mr-5' : 'ml-5'}`}>{name}</span>
		</Link>
	) : (
		<span className="flex-1" />
	)

export default Neighbour
