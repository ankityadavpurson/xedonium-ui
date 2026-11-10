import type { IconProps } from '../../types'

const TelescopeIcon = ({ className }: IconProps) => (
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
		<g transform="rotate(-20 12 10)">
			<path d="M2 8h10v6H2z" />
			<path d="M12 7h5v8h-5z" />
			<path d="M17 6h4v10h-4z" />
		</g>
		<path d="M12 16l-4 6M12 16l4 6M12 16v6" />
	</svg>
)

export default TelescopeIcon
