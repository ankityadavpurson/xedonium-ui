import type { IconProps } from '../../types'

const TimerResetIcon = ({ className }: IconProps) => (
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
		<path d="M10 2h4" />
		<path d="M12 10v4" />
		<path d="M4.5 11A8 8 0 1 1 5 17.5" />
		<path d="M4 6v5.5h5.5" />
	</svg>
)

export default TimerResetIcon
