import type { IconProps } from '../../types'

const AtomIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="1" />
		<g transform="rotate(0 12 12)">
			<path d="M2 12a10 4 0 1 0 20 0 10 4 0 1 0-20 0" />
		</g>
		<g transform="rotate(60 12 12)">
			<path d="M2 12a10 4 0 1 0 20 0 10 4 0 1 0-20 0" />
		</g>
		<g transform="rotate(120 12 12)">
			<path d="M2 12a10 4 0 1 0 20 0 10 4 0 1 0-20 0" />
		</g>
	</svg>
)

export default AtomIcon
