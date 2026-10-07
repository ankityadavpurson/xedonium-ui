import type { IconProps } from '../../types'

const HistoryIcon = ({ className }: IconProps) => (
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
		<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
		<path d="M12 7v5l4 2" />
	</svg>
)

export default HistoryIcon
