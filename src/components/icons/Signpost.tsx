import type { IconProps } from '../../types'

const SignpostIcon = ({ className }: IconProps) => (
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
		<path d="M12 3v2M12 11v2M12 19v3" />
		<path d="M5 5h11l3 3-3 3H5z" />
		<path d="M19 13H8l-3 3 3 3h11z" />
	</svg>
)

export default SignpostIcon
