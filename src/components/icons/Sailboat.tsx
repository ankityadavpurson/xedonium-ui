import type { IconProps } from '../../types'

const SailboatIcon = ({ className }: IconProps) => (
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
		<path d="M12 2v14" />
		<path d="M12 3l8 12h-8" />
		<path d="M10 8l-6 7h6" />
		<path d="M2 18h20l-3 4H5z" />
	</svg>
)

export default SailboatIcon
