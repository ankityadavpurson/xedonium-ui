import type { IconProps } from '../../types'

const RemoveFormattingIcon = ({ className }: IconProps) => (
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
		<path d="M4 7V4h16v3" />
		<path d="M5 20h6" />
		<path d="M13 4L8 20" />
		<path d="M15 15l5 5" />
		<path d="M20 15l-5 5" />
	</svg>
)

export default RemoveFormattingIcon
