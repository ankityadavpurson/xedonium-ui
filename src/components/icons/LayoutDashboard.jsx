const LayoutDashboardIcon = ({ className }) => (
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
		<rect x="3" y="3" width="7" height="9" />
		<rect x="14" y="3" width="7" height="5" />
		<rect x="14" y="12" width="7" height="9" />
		<rect x="3" y="16" width="7" height="5" />
	</svg>
)

export default LayoutDashboardIcon
