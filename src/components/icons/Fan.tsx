import type { IconProps } from '../../types'

const FanIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="2" />
		<g transform="rotate(0 12 12)">
			<path d="M12 10C10 6 11 2 14 2s3 5-1.5 8" />
		</g>
		<g transform="rotate(120 12 12)">
			<path d="M12 10C10 6 11 2 14 2s3 5-1.5 8" />
		</g>
		<g transform="rotate(240 12 12)">
			<path d="M12 10C10 6 11 2 14 2s3 5-1.5 8" />
		</g>
	</svg>
)

export default FanIcon
