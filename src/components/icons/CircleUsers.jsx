const CircleUsersIcon = ({ className }) => (
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
		<circle cx="9.5" cy="9.5" r="2" />
		<circle cx="15.5" cy="10.5" r="1.6" />
		<path d="M5.5 17v-2l1.5-1.5h5l1.5 1.5v2" />
		<path d="M15 13.5h2l1.5 1.5v2" />
	</svg>
)

export default CircleUsersIcon
