const CameraIcon = ({ className }) => (
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
		<path d="M3 7h4l2-3h6l2 3h4v14H3z" />
		<circle cx="12" cy="14" r="4" />
	</svg>
)

export default CameraIcon
