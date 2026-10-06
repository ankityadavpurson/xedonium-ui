const MessageSquareMoreIcon = ({ className }) => (
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
		<path d="M8 10h.01M12 10h.01M16 10h.01" />
	</svg>
)

export default MessageSquareMoreIcon
