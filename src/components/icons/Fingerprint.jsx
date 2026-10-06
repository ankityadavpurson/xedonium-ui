const FingerprintIcon = ({ className }) => (
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
		<path d="M7 20c1-3 1-5 1-8a4 4 0 0 1 8 0c0 3 0 6 1.5 9" />
		<path d="M12 12c0 4-1 6-2 8" />
		<path d="M4 14c0-6 3-11 8-11s8 5 8 11" />
		<path d="M20 17c-.5-1.5-1-3.5-1-5" />
		<path d="M4 18c.5-1 .8-2 1-3" />
	</svg>
)

export default FingerprintIcon
