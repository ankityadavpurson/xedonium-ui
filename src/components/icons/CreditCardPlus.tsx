import type { IconProps } from '../../types'

const CreditCardPlusIcon = ({ className }: IconProps) => (
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
		<path d="M13 19H2V5h20v7" />
		<path d="M2 10h20" />
		<path d="M19 15v6M16 18h6" />
	</svg>
)

export default CreditCardPlusIcon
