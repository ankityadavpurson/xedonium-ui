import type { IconProps } from '../../types'

const ExternalLinkIcon = ({ className }: IconProps) => (
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
		<path d="M18 13v8H3V6h8M15 3h6v6M10 14L21 3" />
	</svg>
)

export default ExternalLinkIcon
