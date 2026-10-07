import type { IconProps } from '../../types'

const PencilIcon = ({ className }: IconProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'h-5 w-5 text-app-soft'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="square"
		strokeLinejoin="miter"
		strokeMiterlimit={10}
	>
		<path d="M17 3l4 4L8 20H4v-4z" />
		<path d="M14 6l4 4" />
	</svg>
)

export default PencilIcon
