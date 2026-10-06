const SunIcon = ({ className }) => (
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
		<circle cx="12" cy="12" r="4" />
		<path d="M19.5,12L22.5,12 M17.3,17.3L19.42,19.42 M12,19.5L12,22.5 M6.7,17.3L4.58,19.42 M4.5,12L1.5,12 M6.7,6.7L4.58,4.58 M12,4.5L12,1.5 M17.3,6.7L19.42,4.58" />
	</svg>
)

export default SunIcon
