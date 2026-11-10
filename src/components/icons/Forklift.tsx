import type { IconProps } from '../../types'

const ForkliftIcon = ({ className }: IconProps) => (
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
		<path d="M12 12H5a2 2 0 0 0-2 2v5" />
		<circle cx="13" cy="19" r="2" />
		<circle cx="5" cy="19" r="2" />
		<path d="M8 19h3m5-17v17h6M6 12V7c0-1.1.9-2 2-2h3l5 5" />
	</svg>
)

export default ForkliftIcon
