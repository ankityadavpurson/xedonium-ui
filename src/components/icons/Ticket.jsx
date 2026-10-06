const TicketIcon = ({ className }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'h-4 w-4'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="square"
		strokeLinejoin="miter"
		strokeMiterlimit={10}
	>
		<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4z" />
		<path d="M13 6v2M13 11v2M13 16v2" />
	</svg>
)

export default TicketIcon
