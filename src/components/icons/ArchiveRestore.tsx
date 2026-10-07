import type { IconProps } from '../../types'

const ArchiveRestoreIcon = ({ className }: IconProps) => (
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
		<path d="M3 8v13h18V8" />
		<rect x="1" y="3" width="22" height="5" />
		<path d="M9 16l3-3 3 3M12 13v7" />
	</svg>
)

export default ArchiveRestoreIcon
