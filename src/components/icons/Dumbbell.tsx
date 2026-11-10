import type { IconProps } from '../../types'

const DumbbellIcon = ({ className }: IconProps) => (
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
		<path d="M6 5v14M18 5v14M3 8v8M21 8v8M6 12h12" />
	</svg>
)

export default DumbbellIcon
