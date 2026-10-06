const MessageSquareTextIcon = ({ className }) => (
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
		<path d="M3 3h18v14H8l-5 4z" />
		<path d="M8 8h8M8 12h5" />
	</svg>
)

export default MessageSquareTextIcon
