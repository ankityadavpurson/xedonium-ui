import type { IconProps } from '../../types'

const WalletIcon = ({ className }: IconProps) => (
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
		<path d="M3 6h16v3M3 6v15h18v-3" />
		<path d="M13 9h8v6h-8z" />
	</svg>
)

export default WalletIcon
