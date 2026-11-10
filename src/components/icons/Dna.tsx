import type { IconProps } from '../../types'

const DnaIcon = ({ className }: IconProps) => (
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
		<path d="M7 2c0 6 10 4 10 10S7 16 7 22" />
		<path d="M17 2c0 6-10 4-10 10s10 4 10 10" />
		<path d="M8 4.5h8M7 12h10M8 19.5h8" />
	</svg>
)

export default DnaIcon
