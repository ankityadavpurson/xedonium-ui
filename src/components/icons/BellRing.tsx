import type { IconProps } from '../../types'

const BellRingIcon = ({ className }: IconProps) => (
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
		<path d="M4 19h16l-2-3V9a6 6 0 0 0-12 0v7z" />
		<path d="M10 22h4" />
		<path d="M2 8a10 10 0 0 1 3-5M22 8a10 10 0 0 0-3-5" />
	</svg>
)

export default BellRingIcon
