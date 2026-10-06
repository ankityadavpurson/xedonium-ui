const ReceiptTextIcon = ({ className }) => (
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
		<path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2V2l-2 2-2-2-2 2-2-2-2 2-2-2z" />
		<path d="M8 8h8M8 12h8M8 16h5" />
	</svg>
)

export default ReceiptTextIcon
