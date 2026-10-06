const FolderOpenIcon = ({ className }) => (
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
		<path d="M3 20V4h7l2 3h8v3" />
		<path d="M5 10h17l-3 10H3z" />
	</svg>
)

export default FolderOpenIcon
