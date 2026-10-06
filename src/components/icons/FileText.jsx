const FileTextIcon = ({ className }) => (
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
		<path d="M4 2h10l6 6v14H4z" />
		<path d="M14 2v6h6" />
		<path d="M16 13H8M16 17H8M10 9H8" />
	</svg>
)

export default FileTextIcon
