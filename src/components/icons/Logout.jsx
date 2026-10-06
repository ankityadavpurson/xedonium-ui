const LogOutIcon = ({ className }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'w-4 h-4'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="square"
		strokeLinejoin="miter"
		strokeMiterlimit={10}
	>
		<path d="M9 3H3v18h6" />
		<path d="M16 17l5-5-5-5" />
		<path d="M21 12H9" />
	</svg>
)

export default LogOutIcon
