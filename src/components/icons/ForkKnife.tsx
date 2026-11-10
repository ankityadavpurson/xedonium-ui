import type { IconProps } from '../../types'

const ForkKnifeIcon = ({ className }: IconProps) => (
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
		<g transform="rotate(-45 12 12)">
			<path d="M9 2v5M12 2v5M15 2v5" />
			<path d="M9 7a3 3 0 0 0 6 0" />
			<path d="M12 10v12" />
		</g>
		<g transform="rotate(45 12 12)">
			<path d="M12 22V12" />
			<path d="M12 2c3 1 3 7 0 10" />
		</g>
	</svg>
)

export default ForkKnifeIcon
