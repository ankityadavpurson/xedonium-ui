const UnlinkIcon = ({ className }) => (
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
		<path d="M10 7H4v10h6" />
		<path d="M14 17h6V7h-6" />
		<path d="M3 3l18 18" />
	</svg>
)

export default UnlinkIcon
