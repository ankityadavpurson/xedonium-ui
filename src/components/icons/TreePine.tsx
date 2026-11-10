import type { IconProps } from '../../types'

const TreePineIcon = ({ className }: IconProps) => (
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
		<path d="M12 2L6 9h3l-5 7h16l-5-7h3z" />
		<path d="M12 16v6" />
	</svg>
)

export default TreePineIcon
