import Label from './Label'

const TRENDS = {
	up: 'text-emerald-700 dark:text-emerald-400',
	down: 'text-red-700 dark:text-red-400',
	flat: 'text-app-muted',
}

/** Single metric tile. `delta` is shown beside the value; `trend` (up | down | flat) colors it. */
const StatCard = ({ label, value, delta, trend = 'flat', hint, className = '' }) => (
	<div className={`flex flex-col gap-1 border border-app-border bg-app-card p-4 ${className}`}>
		<Label>{label}</Label>
		<div className="flex items-baseline gap-2">
			<span className="text-2xl font-bold tracking-tight text-app-text">{value}</span>
			{delta && (
				<span className={`text-xs font-semibold ${TRENDS[trend]}`}>
					<span aria-hidden="true">{trend === 'up' ? '▲ ' : trend === 'down' ? '▼ ' : ''}</span>
					{delta}
				</span>
			)}
		</div>
		{hint && <span className="text-xs text-app-muted">{hint}</span>}
	</div>
)

export default StatCard
