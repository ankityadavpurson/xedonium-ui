const ThumbsUpIcon = ({ className }) => (
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
		<path d="M7 11v10H3V11z" />
		<path d="M7 11l4-8h1a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.3l-1.2 7a2 2 0 0 1-2 1.7H7" />
	</svg>
)

export default ThumbsUpIcon
