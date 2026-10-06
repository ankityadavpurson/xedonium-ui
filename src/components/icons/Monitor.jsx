const MonitorIcon = ({ className }) => (
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
		<rect x="2" y="3" width="20" height="14" />
		<path d="M8 21h8M12 17v4" />
	</svg>
)

export default MonitorIcon
