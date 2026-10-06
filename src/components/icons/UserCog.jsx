const UserCogIcon = ({ className }) => (
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
		<circle cx="19" cy="15" r="2" />
		<path d="M19 11v1M19 18v1M15 15h1M22 15h1M16.2 12.2l.7.7M21.1 17.1l.7.7M21.8 12.2l-.7.7M16.9 17.1l-.7.7" />
	</svg>
)

export default UserCogIcon
