import type { IconProps } from '../../types'

const MicroscopeIcon = ({ className }: IconProps) => (
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
		<path d="M6 18h8" />
		<path d="M3 22h18" />
		<path d="M14 22a7 7 0 1 0 0-14h-1" />
		<path d="M9 14h2" />
		<path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z" />
		<path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
	</svg>
)

export default MicroscopeIcon
