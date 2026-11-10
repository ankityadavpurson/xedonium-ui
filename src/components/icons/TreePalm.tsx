import type { IconProps } from '../../types'

const TreePalmIcon = ({ className }: IconProps) => (
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
		<path d="M12 22c0-6 1-10 4-13" />
		<path d="M16 9c-2-4-6-5-10-3" />
		<path d="M16 9c1-4 4-6 7-6" />
		<path d="M16 9c4 0 6 2 7 5" />
		<path d="M16 9c-4 0-7 1-9 4" />
		<path d="M16 9c0-3-1-5-4-7" />
	</svg>
)

export default TreePalmIcon
