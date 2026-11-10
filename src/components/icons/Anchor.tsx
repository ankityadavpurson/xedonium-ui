import type { IconProps } from '../../types'

const AnchorIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="5" r="2" />
		<path d="M12 7v15" />
		<path d="M9 10h6" />
		<path d="M5 13H2c.5 5 5 9 10 9s9.5-4 10-9h-3" />
	</svg>
)

export default AnchorIcon
