import type { IconProps } from '../../types'

const FileSearchIcon = ({ className }: IconProps) => (
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
		<circle cx="11" cy="14" r="2.5" />
		<path d="M13 16l3 3" />
	</svg>
)

export default FileSearchIcon
