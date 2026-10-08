import type { IconProps } from '../../types'

const ItalicIcon = ({ className }: IconProps) => (
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
		<path d="M19 4h-9" />
		<path d="M14 20H5" />
		<path d="M15 4L9 20" />
	</svg>
)

export default ItalicIcon
