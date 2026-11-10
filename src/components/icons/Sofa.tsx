import type { IconProps } from '../../types'

const SofaIcon = ({ className }: IconProps) => (
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
		<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
		<path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z" />
		<path d="M4 18v2M20 18v2" />
		<path d="M12 4v9" />
	</svg>
)

export default SofaIcon
