const ShieldAlertIcon = ({ className }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'h-4 w-4'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />
		<path d="M12 8v4M12 16h.01" />
	</svg>
)

export default ShieldAlertIcon
