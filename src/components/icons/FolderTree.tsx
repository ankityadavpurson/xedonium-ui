import type { IconProps } from '../../types'

const FolderTreeIcon = ({ className }: IconProps) => (
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
		<path d="M12 3h4l1.5 2H21v6h-9z" />
		<path d="M12 14h4l1.5 2H21v6h-9z" />
		<path d="M3 3v15h9" />
		<path d="M3 7h9" />
	</svg>
)

export default FolderTreeIcon
