import type { IconProps } from '../../types'

const FlowerIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="3" />
		<g transform="rotate(0 12 12)">
			<path d="M10.5 9.5C9 5 10 2 12 2s3 3 1.5 7.5" />
		</g>
		<g transform="rotate(90 12 12)">
			<path d="M10.5 9.5C9 5 10 2 12 2s3 3 1.5 7.5" />
		</g>
		<g transform="rotate(180 12 12)">
			<path d="M10.5 9.5C9 5 10 2 12 2s3 3 1.5 7.5" />
		</g>
		<g transform="rotate(270 12 12)">
			<path d="M10.5 9.5C9 5 10 2 12 2s3 3 1.5 7.5" />
		</g>
	</svg>
)

export default FlowerIcon
