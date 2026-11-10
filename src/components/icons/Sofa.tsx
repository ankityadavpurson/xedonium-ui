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
		<path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3" />
		<path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z" />
		<path d="M5 18v2M19 18v2" />
	</svg>
)

export default SofaIcon
