const FullscreenIcon = ({ className }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'w-4 h-4'}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2}
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M21 8V5a2 2 0 00-2-2h-3" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M3 16v3a2 2 0 002 2h3" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M16 21h3a2 2 0 002-2v-3" />
	</svg>
)

export default FullscreenIcon
