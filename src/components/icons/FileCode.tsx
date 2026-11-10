import type { IconProps } from '../../types'

const FileCodeIcon = ({ className }: IconProps) => (
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
		<path d="M10 13l-2 2 2 2M14 13l2 2-2 2" />
	</svg>
)

export default FileCodeIcon
