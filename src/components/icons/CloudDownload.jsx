const CloudDownloadIcon = ({ className }) => (
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
		<path d="M20 17.6A5 5 0 0 0 18 8h-1.3A8 8 0 1 0 4 16.3" />
		<path d="M12 12v9M8 17l4 4 4-4" />
	</svg>
)

export default CloudDownloadIcon
