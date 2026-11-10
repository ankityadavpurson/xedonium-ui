import type { IconProps } from '../../types'

const CastleIcon = ({ className }: IconProps) => (
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
		<path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z" />
		<path d="M18 11V4H6v7" />
		<path d="M15 22v-4a3 3 0 0 0-6 0v4" />
		<path d="M22 11V9M2 11V9" />
		<path d="M6 4V2M18 4V2M10 4V2M14 4V2" />
	</svg>
)

export default CastleIcon
