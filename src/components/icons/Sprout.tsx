import type { IconProps } from '../../types'

const SproutIcon = ({ className }: IconProps) => (
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
		<path d="M12 22v-9" />
		<path d="M12 13C12 8 8 6 4 6c0 5 3 7 8 7" />
		<path d="M12 15c0-4 3-6 8-6 0 4-3 6-8 6" />
	</svg>
)

export default SproutIcon
