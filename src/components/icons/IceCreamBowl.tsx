import type { IconProps } from '../../types'

const IceCreamBowlIcon = ({ className }: IconProps) => (
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
		<path d="M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6zm-4 4h8m-4-3v3" />
		<path d="M5.14 11a3.5 3.5 0 1 1 6.71 0" />
		<path d="M12.14 11a3.5 3.5 0 1 1 6.71 0" />
		<path d="M15.5 6.5a3.5 3.5 0 1 0-7 0" />
	</svg>
)

export default IceCreamBowlIcon
