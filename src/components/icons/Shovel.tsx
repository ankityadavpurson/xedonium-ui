import type { IconProps } from '../../types'

const ShovelIcon = ({ className }: IconProps) => (
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
		<g transform="rotate(45 12 12)">
			<path d="M12 2v12" />
			<path d="M9 2h6" />
			<path d="M8 14h8l-1 5-3 3-3-3z" />
		</g>
	</svg>
)

export default ShovelIcon
