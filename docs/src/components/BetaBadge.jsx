/** A small "BETA" tag for components that are new and still being tested. */
const BetaBadge = ({ className = '' }) => (
	<span
		title="Beta: new and still being tested, so it may change before it is declared stable"
		className={`shrink-0 border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-900 dark:border-amber-500/40 dark:bg-amber-400/20 dark:text-amber-200 ${className}`}
	>
		Beta
	</span>
)

export default BetaBadge
