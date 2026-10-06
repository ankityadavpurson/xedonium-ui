const CircleDollarSignIcon = ({ className }) => (
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
		<circle cx="12" cy="12" r="10" />
		<path d="M15 8H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H9" />
		<path d="M12 6v2M12 16v2" />
	</svg>
)

export default CircleDollarSignIcon
