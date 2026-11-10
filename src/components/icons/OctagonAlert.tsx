import type { IconProps } from '../../types'

const OctagonAlertIcon = ({ className }: IconProps) => (
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
		<path d="M8 2h8l6 6v8l-6 6H8l-6-6V8z" />
		<path d="M12 8v5M12 16h.01" />
	</svg>
)

export default OctagonAlertIcon
