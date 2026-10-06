const CircleFadingArrowUpIcon = ({ className }) => (
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
		<circle cx="12" cy="12" r="10" strokeDasharray="2 3.2" />
		<path d="M12 16V8" />
		<path d="M8 12l4-4 4 4" />
	</svg>
)

export default CircleFadingArrowUpIcon
