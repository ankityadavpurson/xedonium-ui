const BanknoteIcon = ({ className }) => (
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
		<rect x="2" y="6" width="20" height="12" />
		<circle cx="12" cy="12" r="2" />
		<path d="M6 12h.01M18 12h.01" />
	</svg>
)

export default BanknoteIcon
