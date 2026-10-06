const VolumeOffIcon = ({ className }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'w-4 h-4'}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2}
	>
		<path strokeLinecap="square" strokeLinejoin="miter" d="M11 5L6 9H2v6h4l5 4V5z" />
		<path strokeLinecap="square" strokeLinejoin="miter" d="M23 9l-6 6" />
		<path strokeLinecap="square" strokeLinejoin="miter" d="M17 9l6 6" />
	</svg>
)

export default VolumeOffIcon
