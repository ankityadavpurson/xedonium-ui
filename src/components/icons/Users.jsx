const UsersIcon = ({ className }) => (
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
		<circle cx="9" cy="7" r="4" />
		<path d="M2 21v-3l3-3h8l3 3v3" />
		<path d="M16 3.1a4 4 0 0 1 0 7.8" />
		<path d="M22 21v-3l-3-3" />
	</svg>
)

export default UsersIcon
