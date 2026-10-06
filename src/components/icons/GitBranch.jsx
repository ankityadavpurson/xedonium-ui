const GitBranchIcon = ({ className }) => (
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
		<circle cx="6" cy="18" r="3" />
		<circle cx="18" cy="6" r="3" />
		<path d="M6 3v12" />
		<path d="M18 9a9 9 0 0 1-9 9" />
	</svg>
)

export default GitBranchIcon
