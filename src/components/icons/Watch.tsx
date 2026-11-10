import type { IconProps } from '../../types'

const WatchIcon = ({ className }: IconProps) => (
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
		<path d="M7 6l1-4h8l1 4M7 18l1 4h8l1-4" />
		<circle cx="12" cy="12" r="6" />
		<path d="M12 9v3l2 1.5" />
	</svg>
)

export default WatchIcon
