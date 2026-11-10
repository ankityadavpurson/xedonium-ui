import type { IconProps } from '../../types'

const Building2Icon = ({ className }: IconProps) => (
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
		<path d="M6 21V3h8v18" />
		<path d="M14 9h4v12" />
		<path d="M3 21h18" />
		<path d="M9 7h2M9 11h2M9 15h2" />
		<path d="M16 13h.01M16 17h.01" />
	</svg>
)

export default Building2Icon
