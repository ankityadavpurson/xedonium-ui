const TagIcon = ({ className }) => (
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
		<path d="M2 2h9.17L22 12.83 12.83 22 2 11.17z" />
		<path d="M7.5 7.5h.01" />
	</svg>
)

export default TagIcon
