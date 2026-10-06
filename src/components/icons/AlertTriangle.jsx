const AlertTriangleIcon = ({ className }) => (
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
		<path d="M12 3L2 21h20z" />
		<path d="M12 9v5M12 17h.01" />
	</svg>
)

export default AlertTriangleIcon
