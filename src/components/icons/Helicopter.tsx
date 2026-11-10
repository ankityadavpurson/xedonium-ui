import type { IconProps } from '../../types'

const HelicopterIcon = ({ className }: IconProps) => (
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
		<path d="M2 14a6 6 0 0 1 6-6h5v8H4a2 2 0 0 1-2-2z" />
		<path d="M13 11h8" />
		<path d="M21 11l1-4" />
		<path d="M8 8V5M2 5h13" />
		<path d="M4 20h11M7 16v4M12 16v4" />
	</svg>
)

export default HelicopterIcon
