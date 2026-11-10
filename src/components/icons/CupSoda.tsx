import type { IconProps } from '../../types'

const CupSodaIcon = ({ className }: IconProps) => (
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
		<path d="M6 8h12" />
		<path d="M7 8l1 13h8l1-13" />
		<path d="M13 8l1-5h4" />
		<path d="M7 13h10" />
	</svg>
)

export default CupSodaIcon
