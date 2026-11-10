import type { IconProps } from '../../types'

const PawPrintIcon = ({ className }: IconProps) => (
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
		<circle cx="5" cy="11" r="1.5" />
		<circle cx="9" cy="6" r="1.5" />
		<circle cx="15" cy="6" r="1.5" />
		<circle cx="19" cy="11" r="1.5" />
		<path d="M12 12c-4 0-6 4-6 6.5 0 2 1.5 2.5 3 2s2-.5 3-.5 2 .5 3 .5 3-.5 3-2.5c0-2.5-2-6-6-6z" />
	</svg>
)

export default PawPrintIcon
