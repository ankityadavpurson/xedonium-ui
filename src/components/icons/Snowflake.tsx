import type { IconProps } from '../../types'

const SnowflakeIcon = ({ className }: IconProps) => (
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
		<g transform="rotate(0 12 12)">
			<path d="M12 2v20M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5" />
		</g>
		<g transform="rotate(60 12 12)">
			<path d="M12 2v20M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5" />
		</g>
		<g transform="rotate(120 12 12)">
			<path d="M12 2v20M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5" />
		</g>
	</svg>
)

export default SnowflakeIcon
