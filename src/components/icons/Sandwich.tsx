import type { IconProps } from '../../types'

const SandwichIcon = ({ className }: IconProps) => (
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
		<path d="M12 2v6" />
		<path d="M12 2h4l-1 1.5L16 5h-4" />
		<path d="M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3z" />
		<path d="M3 15c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3 1.5 4.5 0" />
		<path d="M3 19h18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
	</svg>
)

export default SandwichIcon
