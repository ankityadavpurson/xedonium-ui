const ArchiveIcon = ({ className }) => (
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
		<path d="M3 8v13h18V8" />
		<rect x="1" y="3" width="22" height="5" />
		<path d="M10 12h4" />
	</svg>
)

export default ArchiveIcon
