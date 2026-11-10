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
		<path d="M14 2H6v20h12V8z" />
		<path d="M14 2v6h4" />
		<circle cx="11" cy="14" r="3" />
		<path d="M13.2 16.2L16 19" />
	</svg>
)

export default FileSearchIcon
