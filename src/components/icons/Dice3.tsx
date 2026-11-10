import type { IconProps } from '../../types'

const Dice3Icon = ({ className }: IconProps) => (
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
		<rect x="4" y="4" width="16" height="16" />
		<path d="M8 8h.01M12 12h.01M16 16h.01" />
	</svg>
)

export default Dice3Icon
