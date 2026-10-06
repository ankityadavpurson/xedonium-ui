const CloudIcon = ({ className }) => (
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
		<path d="M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
	</svg>
)

export default CloudIcon
