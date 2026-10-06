const NetworkIcon = ({ className }) => (
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
		<rect x="16" y="16" width="6" height="6" />
		<rect x="2" y="16" width="6" height="6" />
		<rect x="9" y="2" width="6" height="6" />
		<path d="M5 16v-4h14v4" />
		<path d="M12 12V8" />
	</svg>
)

export default NetworkIcon
