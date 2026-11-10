import type { IconProps } from '../../types'

const PiggyBankIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="3.5" r="2" />
		<path d="M4 13c0-4 3-6 8-6 4 0 7 2 8 5h2v4h-2c-1 2-2 3-3 3v2h-3v-2h-4v2H7v-2c-2-1-3-3-3-6z" />
		<path d="M16 12h.01" />
	</svg>
)

export default PiggyBankIcon
