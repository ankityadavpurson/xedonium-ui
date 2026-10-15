import type { IconProps } from '../../types'

const KeyboardIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="5" width="20" height="14" />
		<path d="M6 9h1M10 9h1M14 9h1M18 9h1M6 13h1M10 13h1M14 13h1M18 13h1M8 16h8" />
	</svg>
)

export default KeyboardIcon
