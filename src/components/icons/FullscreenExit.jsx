const FullscreenExitIcon = ({ className }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'w-4 h-4'}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2}
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3a2 2 0 01-2 2H3" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M21 8h-3a2 2 0 01-2-2V3" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M3 16h3a2 2 0 012 2v3" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-3a2 2 0 012-2h3" />
	</svg>
)

export default FullscreenExitIcon
