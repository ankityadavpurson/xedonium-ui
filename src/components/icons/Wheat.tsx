import type { IconProps } from '../../types'

const WheatIcon = ({ className }: IconProps) => (
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
		<path d="M12 11v11" />
		<path d="M12 2l-2 3 2 3 2-3z" />
		<path d="M12 11c-3 0-5-2-5-5 3 0 5 2 5 5z" />
		<path d="M12 11c3 0 5-2 5-5-3 0-5 2-5 5z" />
		<path d="M12 17c-3 0-5-2-5-5 3 0 5 2 5 5z" />
		<path d="M12 17c3 0 5-2 5-5-3 0-5 2-5 5z" />
	</svg>
)

export default WheatIcon
