import type { IconProps } from '../../types'

const BanknoteIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="6" width="20" height="12" />
		<circle cx="12" cy="12" r="2" />
		<path d="M5.5 6A3.5 3.5 0 0 1 2 9.5M22 9.5A3.5 3.5 0 0 1 18.5 6M18.5 18a3.5 3.5 0 0 1 3.5-3.5M2 14.5A3.5 3.5 0 0 1 5.5 18" />
	</svg>
)

export default BanknoteIcon
