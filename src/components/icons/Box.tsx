import type { IconProps } from '../../types'

const BoxIcon = ({ className }: IconProps) => (
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
		<path d="M21 8l-9-5-9 5v8l9 5 9-5z" />
		<path d="M3 8l9 5 9-5M12 13v8" />
	</svg>
)

export default BoxIcon
