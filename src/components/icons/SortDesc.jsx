const SortDescIcon = ({ className }) => (
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
		<path d="M3 16l3 3 3-3M6 19V5" />
		<path d="M11 5h4M11 10h7M11 15h10" />
	</svg>
)

export default SortDescIcon
