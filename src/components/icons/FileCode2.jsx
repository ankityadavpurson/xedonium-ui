const FileCode2Icon = ({ className }) => (
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
		<path d="M4 22h16V7l-5-5H4v6" />
		<path d="M14 2v6h6" />
		<path d="M5 12l-3 3 3 3" />
		<path d="M9 18l3-3-3-3" />
	</svg>
)

export default FileCode2Icon
