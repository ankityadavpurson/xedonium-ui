const ThumbsDownIcon = ({ className }) => (
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
		<path d="M7 13V3H3v10z" />
		<path d="M7 13l4 8h1a2 2 0 0 0 2-2v-4h5.5a2 2 0 0 0 2-2.3l-1.2-7a2 2 0 0 0-2-1.7H7" />
	</svg>
)

export default ThumbsDownIcon
