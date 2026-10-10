import type { IconProps } from '../../types'

const PaletteIcon = ({ className }: IconProps) => (
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
		<path d="M12 3a9 9 0 1 0 0 18c1 0 2-.7 2-2v-1c0-1 .8-2 2-2h2c1.1 0 2-.9 2-2 0-5-4-11-8-11z" />
		<path d="M7.5 11h.01" />
		<path d="M10.5 7h.01" />
		<path d="M15 8h.01" />
	</svg>
)

export default PaletteIcon
