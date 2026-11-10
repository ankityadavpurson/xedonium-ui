import type { IconProps } from '../../types'

const WineIcon = ({ className }: IconProps) => (
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
		<path d="M8 2h8l1 7a5 5 0 0 1-10 0z" />
		<path d="M12 14v8M8 22h8" />
	</svg>
)

export default WineIcon
