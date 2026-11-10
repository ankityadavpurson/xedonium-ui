import type { IconProps } from '../../types'

const BrainIcon = ({ className }: IconProps) => (
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
		<g transform="translate(0 0)">
			<path d="M12 4c-1-2-4-2-5.5-.5C4.5 3.5 3 5.5 4 7.5 2 9 2 12 4 13.5 3.5 16 5.5 18 7.5 18 9 20 12 20 12 20" />
			<path d="M6 9h3M5.5 14H9" />
		</g>
		<g transform="translate(24 0) scale(-1 1)">
			<path d="M12 4c-1-2-4-2-5.5-.5C4.5 3.5 3 5.5 4 7.5 2 9 2 12 4 13.5 3.5 16 5.5 18 7.5 18 9 20 12 20 12 20" />
			<path d="M6 9h3M5.5 14H9" />
		</g>
		<path d="M12 4v16" />
	</svg>
)

export default BrainIcon
